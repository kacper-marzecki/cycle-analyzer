use crate::error::AppError::IoError;

#[derive(Debug)]
pub enum AppError {
    IoError(String)
}

impl From<std::io::Error> for AppError {
    fn from(err: std::io::Error) -> Self {
        IoError(format!("IO Error {}", err))
    }
}
