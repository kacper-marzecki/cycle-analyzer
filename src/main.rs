use std::convert::{AsRef, identity};
use std::fmt::Debug;
use std::fs::{self, DirEntry, File, ReadDir};
use std::io::BufRead;
use std::path::Path;

use log::info;
use petgraph::algo::tarjan_scc;
use petgraph::graphmap::DiGraphMap;
use structopt::StructOpt;

use crate::configuration::Configuration;
use crate::error::AppError;
use crate::model::{AnalysisResult, Package};
use crate::parsers::parse_package_under;
use crate::server::start_server;
use crate::utils::{OptionExtensions, VecExtensions};

mod parsers;
mod utils;
mod model;
mod error;
mod server;
mod configuration;

fn read_lines<P>(filename: &P) -> std::io::Lines<std::io::BufReader<File>>
    where P: AsRef<Path> + Debug, {
    let file = File::open(filename).unwrap_or_else(|_| panic!("cannot open file {:?}", filename));
    std::io::BufReader::new(file).lines()
}

fn read_or_panik<T: Debug + AsRef<Path>>(path: &T) -> ReadDir {
    fs::read_dir(path)
        .unwrap_or_else(|_| panic!("cannot read {:?}", path))
}

fn extract_imports(target_package: &str, dir: DirEntry) -> Vec<String> {
    if dir.path().is_dir() {
        read_or_panik(&dir.path())
            .filter_map(|it| it.ok())
            .map(|it| {
                extract_imports(target_package, it)
            }).fold(vec![], utils::concat)
    } else if dir.path().is_file() {
        read_lines(&dir.path())
            .filter_map(|maybe_it| {
                maybe_it.map(|it| {
                    parsers::parse_line_for_package_import(it, target_package)
                }).ok()
            }).filter_map(identity)
            .collect()
    } else {
        vec![]
    }
}

fn extract_used_packages(classes: &Vec<String>, base_package: &String) -> Vec<String> {
    classes.iter()
        .filter_map(|it| parse_package_under(it, base_package))
        .collect()
}

fn is_dir(d: &DirEntry) -> bool {
    d.file_type()
        .map(|it| it.is_dir())
        .unwrap_or_else(|err| panic!("Do you have appropriate permissions ? {:?}", err))
}

fn file_name(d: &DirEntry) -> String {
    d.file_name().to_str().unwrap().to_string()
}

fn read_package(dir: DirEntry, target_package: &String) -> Option<Package> {
    let file_name = file_name(&dir);
    let full_package_name = format!("{}.{}", target_package, file_name.clone());
    let foreign_imports =
        extract_imports(target_package.as_str(), dir).into_iter()
            .filter(|it| !it.starts_with(&full_package_name))
            .collect::<Vec<String>>()
            .unique();
    let other_used_packages = extract_used_packages(&foreign_imports, &target_package).unique();
    Package {
        name: file_name,
        base_package: target_package.clone(),
        foreign_imports,
        other_used_packages,
    }.as_some()
}

fn collect_package_info(project_path: String, target_package: String) -> Vec<Package> {
    let package_path = format!("{}/src/main/java/{}", project_path, target_package.replace(".", "/"));
    read_or_panik(&package_path)
        .filter_map(|it| it.ok())
        .filter(is_dir)
        .filter_map(|dir| read_package(dir, &target_package))
        .collect()
}

fn run_analysis(project_path: String, target_package: String) -> Result<AnalysisResult, AppError> {
    let packages = collect_package_info(project_path, target_package);
    let graph = construct_graph(&packages);
    let components = tarjan_scc(&graph);

    let cycles: Vec<Vec<String>> = components.into_iter().filter(|it| it.len() > 1)
        .map(|vec| vec.into_iter().map(|package| package.to_string()).collect())
        .collect();
    Ok(AnalysisResult {
        packages,
        cycles,
    })
}

fn construct_graph(packages: &Vec<Package>) -> DiGraphMap<&str, &str> {
    let mut graph = DiGraphMap::<&str, &str>::new();
    packages.iter().for_each(|pack| { &mut graph.add_node(pack.name.as_str()); });
    packages.iter().for_each(|pack| {
        pack.other_used_packages.iter().for_each(|other| {
            &mut graph.add_edge(pack.name.as_str(), other.as_str(), "");
        })
    });
    graph
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    std::env::set_var("RUST_LOG", "arch_ferrite=info,actix_web=info");
    env_logger::init();
    let configuration: Configuration = Configuration::from_args();

    info!("Running analysis with: {:#?}", configuration);
    let analysis = run_analysis(configuration.project_location, configuration.root_package).unwrap();
    if configuration.server {
        start_server(analysis, configuration.port).await
    } else {
        Ok(())
    }
}
