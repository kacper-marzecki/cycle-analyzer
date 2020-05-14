use serde::Serialize;

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
    pub cycles: Vec<Cycle>,
    pub packages: Vec<Package>,
}

#[derive(Debug, Clone, Serialize)]
pub struct Cycle {
    pub new_cycle: bool,
    pub packages: Vec<String>
}