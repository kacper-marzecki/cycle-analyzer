use std::collections::HashMap;

use actix_web::{HttpResponse, middleware, web};
use actix_web::{App, HttpServer};
use actix_web_static_files;
use log::info;
use serde::{Serialize};

use crate::model::{AnalysisResult, Package, Cycle};

#[derive(Debug, Clone, Serialize)]
struct CycleResponse<'a> {
    pub packages: &'a Vec<String>,
    pub new_cycle: bool,
    pub id: usize
}


async fn get_cycles(results: web::Data<AnalysisResult>) -> HttpResponse {
    HttpResponse::Ok().json(
        results.cycles.iter().enumerate().map(|(index, it) | CycleResponse {
            packages: &it.packages,
            new_cycle: it.new_cycle,
            id: index
        }).collect::<Vec<CycleResponse>>()
    )
}

#[derive(Debug, Clone, Serialize)]
struct PackageResponse {
    name: String,
    uses: Vec<String>,
}

async fn get_graph_for_cycle(results: web::Data<AnalysisResult>, cycle: web::Path<usize>) -> HttpResponse {
    let cycle: &Cycle = results.cycles.get(cycle.into_inner()).unwrap();
    let response: Vec<PackageResponse> = results.packages.iter()
        .filter(|p| cycle.packages.contains(&p.name)).map(|p| PackageResponse {
        name: p.name.clone(),
        uses: p.other_used_packages.clone().into_iter().filter(|p| cycle.packages.contains(p)).collect(),
    }).collect();
    HttpResponse::Ok().json(response)
}

async fn get_complete_graph(results: web::Data<AnalysisResult>) -> HttpResponse {
    let response: Vec<PackageResponse> = results.packages.iter()
        .map(|p| PackageResponse {
            name: p.name.clone(),
            uses: p.other_used_packages.clone(),
        }).collect();
    HttpResponse::Ok().json(response)
}

fn get_package_by_name<'a>(packages: &'a Vec<Package>, name: &'a String) -> Option<&'a Package> {
    return packages.into_iter().find(|p| p.name.eq_ignore_ascii_case(name.as_str()));
}

#[derive(Debug, Clone, Serialize)]
struct ImportInfoResponse {
    from: String,
    to: String,
    imports: Vec<String>,
}

async fn get_imports_from_to(results: web::Data<AnalysisResult>, request: web::Path<(String, String)>) -> HttpResponse {
    let (from, to) = request.into_inner();
    let package = get_package_by_name(&results.packages, &from).unwrap();
    let result: Vec<String> = package.foreign_imports.clone().into_iter().filter(|it| it.contains(to.as_str())).collect();
    HttpResponse::Ok().json(ImportInfoResponse {
        from,
        to,
        imports: result,
    })
}

include!(concat!(env!("OUT_DIR"), "/generated.rs"));

pub async fn start_server(data: AnalysisResult, port: u16) -> std::io::Result<()> {
    info!("starting server with analysis results on port {}", port);
    HttpServer::new(move || {
        let frontend_resources = generate();
        App::new()
            .wrap(middleware::Logger::default())
            .data(data.clone())
            .route("/graph", web::to(get_complete_graph))
            .route("/cycles", web::to(get_cycles))
            .route("/cycle/{cycle_id}", web::to(get_graph_for_cycle))
            .route("/imports/{from}/{to}", web::to(get_imports_from_to))
            .service(actix_web_static_files::ResourceFiles::new(
                "/", frontend_resources,
            ))
    })
        .bind(format!("0.0.0.0:{}", port))?
        .run()
        .await
}