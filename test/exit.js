process.on("KILLALL", function () {
    server.end();
    process.exit(0);
});