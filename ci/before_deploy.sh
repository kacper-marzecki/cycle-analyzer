set -ex
main() {
    local src=$(pwd) \
          stage=
    case $TRAVIS_OS_NAME in
        linux)
            stage=$(mktemp -d)
            ;;
        osx)
            stage=$(mktemp -d -t tmp)
            ;;
    esac

    test -f Cargo.lock || cargo generate-lockfile

    # CUSTOM
    cross rustc --bin cycle-analyzer --target $TARGET --release -- -C lto

    # CUSTOM
    cp target/$TARGET/release/cycle-analyzer* $stage/

    cd $stage
    tar czf $src/$CRATE_NAME-$TRAVIS_TAG-$TARGET.tar.gz *
    cd $src

    rm -rf $stage
}

main
