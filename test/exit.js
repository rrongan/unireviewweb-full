process.on("SIGKILL", function () {
    server.end();
    process.exit(0);
});