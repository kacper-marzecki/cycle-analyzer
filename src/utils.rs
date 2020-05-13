pub trait VecExtensions {
    fn unique(self) -> Self;
}

impl VecExtensions for Vec<String> {
    fn unique(self) -> Vec<String> {
        let mut asd = self;
        asd.sort();
        asd.dedup_by(|a, b| a.eq_ignore_ascii_case(b));
        asd
    }
}

pub fn concat<T: Clone>(one: Vec<T>, two: Vec<T>) -> Vec<T> {
    [&one[..], &two[..]].concat()
}