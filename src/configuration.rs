use structopt::StructOpt;

#[derive(StructOpt, Debug)]
#[structopt(name = "ch")]
pub struct Configuration {
    /// start server serving analysis results
    #[structopt(short, long)]
    pub server: bool,
    #[structopt(short, long, default_value = "30000")]
    pub port: u16,
    /// project location e.g. /home/user/project_root
    #[structopt(long)]
    pub project_location: String,
    /// package to analyze e.g. com.acme.something
    #[structopt(long)]
    pub root_package: String,
    /// file containing list of known cycles to be ignored in the cycle analysis
    /// the format for the file: on each line there should be a comma-delimited list of package names.
    /// Each line represents a known cycle
    #[structopt(short, long)]
    pub ignored_cycles_file: Option<String>,
}
