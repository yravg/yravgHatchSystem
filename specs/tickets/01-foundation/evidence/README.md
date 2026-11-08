Evidence for ticket 01.
- vps/: Linux run (Ubuntu 24.04, node v26.13.0 + v24.21.0, pnpm 10.33.0, JDK 21.0.13, Gradle 9.9.0, dotnet 10.0.403): gates, Kotlin, .NET, ticket dispatcher, clean clone, Playwright launch failure.
- laptop/: earlier Windows run logs (Node 24.14.1). Its test-ticket.log is INCOMPLETE (Kotlin and .NET were not yet run) and is superseded by vps/test-ticket-01.log.
- artifacts/ is git-ignored (binary screenshot and trace). sha256, size and the producing command are in requirements-evidence.json.
See requirements-evidence.json and ../results.md.
