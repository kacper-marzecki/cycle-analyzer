use serde::Serialize;
use petgraph::graphmap::{GraphMap, DiGraphMap};

#[derive(Debug)]
pub struct Class {
    name: String,
    imports: Vec<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct Package {
    pub name: String,
    pub foreign_imports: Vec<String>,
    pub other_used_packages: Vec<String>,
    pub base_package: String,
}

#[derive(Debug, Clone)]
pub struct AnalysisResult {
    pub cycles: Vec<Vec<String>>,
    pub packages: Vec<Package>,
}
