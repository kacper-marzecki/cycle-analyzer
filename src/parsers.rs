use nom::branch::alt;
use nom::bytes::complete::{tag, take, take_till, take_until, take_while};
use nom::combinator::{flat_map, map, map_parser, map_parserc, map_res, rest};
use nom::FindSubstring;
use nom::IResult;
use nom::sequence::preceded;
use nom::error;

fn has_import_prefix(input: &str) -> IResult<&str, &str> {
    alt((
        tag("import static "),
        tag("import ")
    ))(input)
}

fn take_till_semicolon(input: &str) -> IResult<&str, &str> {
    take_until(";")(input)
}

fn begins_with<'a>(input: &'a str, chars: &'a str) -> IResult<&'a str, &'a str> {
    tag(chars)(input)
}

fn find_import<'a>(input: &'a str, target_package: &'a str) -> IResult<&'a str, &'a str> {
    let import_line = map_parser(
        preceded(has_import_prefix, rest),
        preceded(tag(target_package), rest)
    );
    map_parser(import_line, take_till_semicolon)(input)
}

pub fn parse_line_for_package_import(line: String, package: &str) -> Option<String> {
    find_import(&line[..], package)
        .ok()
        .map(|(input, output)| format!("{}{}", package, output))
}

pub fn parse_package_under(package_name: &String, base_package: &String) -> Option<String> {
    let prefix = format!("{}.", base_package);
    let result: IResult<&str, &str> =
        map_parser(
            preceded(tag(prefix.as_str()), rest),
            take_until("."),
        )(package_name);
    result.ok()
        .map(|(input, output)| output.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn take_till_semicolon_works() {
        let input = "ABCD;";
        let (remaining, output) = take_till_semicolon(input).unwrap();
        assert_eq!(output, "ABCD");
        assert_eq!(remaining, ";");
    }

    #[test]
    fn has_import_works() {
        let input = "import test.string;";
        let (remaining, output) = has_import_prefix(input).unwrap();
        assert_eq!(output, "import ");
        assert_eq!(remaining, "test.string;");
    }

    #[test]
    fn has_static_import_works() {
        let input = "import static test.string;";
        let (remaining, output) = has_import_prefix(input).unwrap();
        assert_eq!(output, "import static ");
        assert_eq!(remaining, "test.string;");
    }

    #[test]
    fn find_import_from_target_package_works() {
        let input = "import static test.string.kek;";
        let (remaining, output) = find_import(input, "test.string").unwrap();
        assert_eq!(output, ".kek");
    }

    #[test]
    fn parse_a_line_for_package_import_works() {
        let input = "import static test.string.kek;";
        let result = parse_line_for_package_import(input.to_string(), "test.string").unwrap();
        assert_eq!(result, "test.string.kek".to_string());
    }

    #[test]
    fn parse_package_under_works() {
        let package_name = "com.acme.something.else";
        let base_package = "com.acme";
        let result= parse_package_under(&package_name.to_string(), &base_package.to_string()).unwrap();
        assert_eq!(result, "something");
    }
}