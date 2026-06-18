#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════════════════╗
║         AUTO-PUSH AGENT — Smart Parking Security & E2E Test Suite           ║
║                                                                              ║
║  What this agent does:                                                       ║
║  1. Stages all new security/test files                                       ║
║  2. Commits with a descriptive message                                       ║
║  3. Pushes to GitHub (origin/main)                                           ║
║  4. Watches GitHub Actions until all workflows complete                      ║
║  5. Downloads and displays the final report summary                          ║
║                                                                              ║
║  Requirements: git, GitHub CLI (gh) — install from https://cli.github.com   ║
║  Usage:  python scripts/push_and_run_agent.py                               ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

import subprocess
import sys
import os
import time
import json
import shutil
from datetime import datetime

# ─────────────────────────────────────────────────────────
# Config
# ─────────────────────────────────────────────────────────
REPO_ROOT    = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REMOTE       = "origin"
BRANCH       = "main"
GH_REPO      = "Viru-6281/spic-pdd"

# Files to stage (relative to repo root)
FILES_TO_ADD = [
    ".github/workflows/security-review.yml",
    ".github/workflows/deploy-and-test.yml",
    "scripts/generate_security_report.py",
    "scripts/generate_test_report.py",
    "scripts/push_and_run_agent.py",
    "selenium-tests/tests/test_e2e.py",
    "selenium-tests/pages/page_objects.py",
    "selenium-tests/pytest.ini",
    "Vulnerability Test Results/security-review.md",
    "Vulnerability Test Results/executive-summary.md",
    "Vulnerability Test Results/dependency-report.md",
    "Vulnerability Test Results/SETUP-GUIDE.md",
]

COMMIT_MSG = """ci: Add security review pipeline + Selenium E2E test suite

Security Assessment (17 findings):
  - CRITICAL: No authentication on any API endpoint
  - CRITICAL: Wildcard CORS (@CrossOrigin(*)) on all controllers
  - CRITICAL: IDOR - no ownership checks on any resource
  - HIGH: Hardcoded MySQL root credentials in application.properties
  - HIGH: Unsafe file upload (path traversal via getOriginalFilename)
  - 12 more findings - see Vulnerability Test Results/security-review.md

New files:
  .github/workflows/security-review.yml    - SAST + Semgrep + OWASP + Gitleaks + Trivy
  .github/workflows/deploy-and-test.yml    - GitHub Pages deploy + Selenium E2E
  scripts/generate_security_report.py      - Excel security reports (findings.xlsx)
  scripts/generate_test_report.py          - Excel E2E report (Automation_Test_Report.xlsx)
  selenium-tests/tests/test_e2e.py         - 16 Selenium test cases (XSS, SQLi, nav, responsive)
  selenium-tests/pages/page_objects.py     - Page Object Model
  Vulnerability Test Results/              - Full security assessment reports

Overall Security Score: 8/100 - NOT production ready"""

# ─────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────

def run(cmd, cwd=None, capture=True, check=True):
    """Run a shell command and return (stdout, stderr, returncode)."""
    result = subprocess.run(
        cmd, shell=True, cwd=cwd or REPO_ROOT,
        capture_output=capture, text=True
    )
    if check and result.returncode != 0:
        print(f"\n❌ Command failed: {cmd}")
        print(f"   stdout: {result.stdout.strip()}")
        print(f"   stderr: {result.stderr.strip()}")
        sys.exit(1)
    return result.stdout.strip(), result.stderr.strip(), result.returncode


def print_header(text):
    width = 72
    print("\n" + "═" * width)
    print(f"  {text}")
    print("═" * width)


def print_step(step, text):
    print(f"\n  [{step}] {text}")


def print_ok(text):
    print(f"       ✅  {text}")


def print_warn(text):
    print(f"       ⚠️   {text}")


def print_info(text):
    print(f"       ℹ️   {text}")


def gh_available():
    result = subprocess.run("gh --version", shell=True, capture_output=True)
    return result.returncode == 0


def check_gh_auth():
    out, _, rc = run("gh auth status", check=False)
    return rc == 0


# ─────────────────────────────────────────────────────────
# Step 1 — Pre-flight checks
# ─────────────────────────────────────────────────────────

def preflight():
    print_header("STEP 1 — Pre-flight Checks")

    # git
    out, _, _ = run("git --version")
    print_ok(f"git: {out}")

    # Remote
    out, _, _ = run("git remote get-url origin")
    print_ok(f"Remote: {out}")

    # Branch
    out, _, _ = run("git branch --show-current")
    print_ok(f"Branch: {out}")

    # GitHub CLI
    if gh_available():
        print_ok("GitHub CLI (gh) is available")
        if check_gh_auth():
            print_ok("GitHub CLI authenticated")
        else:
            print_warn("GitHub CLI not authenticated — workflow monitoring will be skipped")
            print_info("Run: gh auth login  to enable workflow monitoring")
    else:
        print_warn("GitHub CLI not found — install from https://cli.github.com")
        print_info("Without gh CLI, workflow monitoring will be skipped")
        print_info("You can manually check: https://github.com/Viru-6281/spic-pdd/actions")


# ─────────────────────────────────────────────────────────
# Step 2 — Stage files
# ─────────────────────────────────────────────────────────

def stage_files():
    print_header("STEP 2 — Staging Files")

    staged_count = 0
    missing = []

    for f in FILES_TO_ADD:
        full_path = os.path.join(REPO_ROOT, f)
        if os.path.exists(full_path):
            run(f'git add "{f}"')
            print_ok(f"Staged: {f}")
            staged_count += 1
        else:
            print_warn(f"Missing (skipped): {f}")
            missing.append(f)

    # Also stage any other untracked files in known dirs
    extra_dirs = [
        ".github/workflows/",
        "scripts/",
        "selenium-tests/",
        "Vulnerability Test Results/",
    ]
    for d in extra_dirs:
        if os.path.exists(os.path.join(REPO_ROOT, d)):
            run(f'git add "{d}"', check=False)

    # Stage modified files too
    run("git add mobile/src/app/edit-user-profile.tsx", check=False)

    # Show what's staged
    out, _, _ = run("git diff --cached --name-only")
    all_staged = [l.strip() for l in out.splitlines() if l.strip()]

    print(f"\n  📦 Total files staged: {len(all_staged)}")
    for f in all_staged:
        print(f"       • {f}")

    if not all_staged:
        print_warn("Nothing to commit — all files already in sync with remote")
        return False

    return True


# ─────────────────────────────────────────────────────────
# Step 3 — Commit
# ─────────────────────────────────────────────────────────

def commit():
    print_header("STEP 3 — Committing")

    # Check if there's anything to commit
    out, _, rc = run("git diff --cached --quiet", check=False)
    if rc == 0:
        print_info("Nothing to commit — working tree already clean")
        return None

    # Set git identity if not set
    user_name, _, rc1 = run("git config user.name", check=False)
    user_email, _, rc2 = run("git config user.email", check=False)
    if not user_name or rc1 != 0:
        run('git config user.name "Security Agent"')
    if not user_email or rc2 != 0:
        run('git config user.email "security@agent.local"')

    # Write commit message to temp file to handle multi-line
    msg_file = os.path.join(REPO_ROOT, ".git", "AGENT_COMMIT_MSG")
    with open(msg_file, "w", encoding="utf-8") as f:
        f.write(COMMIT_MSG)

    run(f'git commit -F "{msg_file}"')

    # Get commit hash
    sha, _, _ = run("git rev-parse HEAD")
    short_sha = sha[:8]
    print_ok(f"Committed: {short_sha}")
    print_info(f"Message: ci: Add security review pipeline + Selenium E2E test suite")

    return short_sha


# ─────────────────────────────────────────────────────────
# Step 4 — Push
# ─────────────────────────────────────────────────────────

def push():
    print_header("STEP 4 — Pushing to GitHub")
    print_info(f"Pushing to {REMOTE}/{BRANCH} ...")

    out, err, rc = run(f"git push {REMOTE} {BRANCH}", check=False)
    if rc != 0:
        # Try with upstream set
        out2, err2, rc2 = run(f"git push --set-upstream {REMOTE} {BRANCH}", check=False)
        if rc2 != 0:
            print(f"\n❌ Push failed!")
            print(f"   {err}")
            print(f"\n💡 If you see an authentication error, try:")
            print(f"   gh auth login")
            print(f"   or configure a Personal Access Token:")
            print(f"   git remote set-url origin https://<token>@github.com/Viru-6281/spic-pdd.git")
            sys.exit(1)

    print_ok(f"Pushed to https://github.com/{GH_REPO}/tree/{BRANCH}")
    print_ok(f"Actions will trigger at: https://github.com/{GH_REPO}/actions")


# ─────────────────────────────────────────────────────────
# Step 5 — Monitor GitHub Actions
# ─────────────────────────────────────────────────────────

def monitor_workflows(commit_sha):
    print_header("STEP 5 — Monitoring GitHub Actions")

    if not gh_available() or not check_gh_auth():
        print_warn("GitHub CLI not available/authenticated — cannot monitor automatically")
        print_info(f"Watch progress at: https://github.com/{GH_REPO}/actions")
        print_info("Download artifacts from completed workflow runs")
        return

    print_info("Waiting 15 seconds for GitHub to register the push...")
    time.sleep(15)

    WATCH_WORKFLOWS = ["security-review.yml", "deploy-and-test.yml", "build.yml"]
    MAX_WAIT_SECS   = 600   # 10 minutes max
    POLL_INTERVAL   = 20    # check every 20 seconds

    started = time.time()
    run_ids = {}  # workflow_file -> run_id

    print_info("Discovering workflow runs triggered by this push...")

    # Poll until we find runs for all workflows
    for attempt in range(20):
        for wf in WATCH_WORKFLOWS:
            if wf in run_ids:
                continue
            out, _, rc = run(
                f'gh run list --repo {GH_REPO} --workflow {wf} --limit 1 --json databaseId,status,conclusion,headSha',
                check=False
            )
            if rc != 0:
                continue
            try:
                runs = json.loads(out)
                if runs and (commit_sha is None or runs[0].get("headSha", "").startswith(commit_sha[:7])):
                    run_ids[wf] = runs[0]["databaseId"]
                    print_ok(f"Found run for {wf}: #{runs[0]['databaseId']}")
            except Exception:
                pass

        if len(run_ids) >= len(WATCH_WORKFLOWS):
            break
        time.sleep(8)

    if not run_ids:
        print_warn("Could not find any triggered workflow runs")
        print_info(f"Check manually: https://github.com/{GH_REPO}/actions")
        return

    # Poll until all runs complete
    print_info(f"\n  Watching {len(run_ids)} workflow(s)... (max {MAX_WAIT_SECS}s)")
    print_info("  Press Ctrl+C to stop monitoring (workflows will continue on GitHub)\n")

    results = {}
    while time.time() - started < MAX_WAIT_SECS:
        all_done = True
        for wf, run_id in run_ids.items():
            if wf in results:
                continue
            out, _, rc = run(
                f'gh run view {run_id} --repo {GH_REPO} --json status,conclusion,name',
                check=False
            )
            if rc != 0:
                all_done = False
                continue
            try:
                data = json.loads(out)
                status     = data.get("status", "unknown")
                conclusion = data.get("conclusion", "")
                name       = data.get("name", wf)

                elapsed = int(time.time() - started)
                icon = "⏳" if status not in ("completed",) else ("✅" if conclusion == "success" else "❌")
                print(f"  {icon} [{elapsed:>3}s] {name:<45} {status:<12} {conclusion}")

                if status == "completed":
                    results[wf] = conclusion
            except Exception:
                all_done = False

        if len(results) == len(run_ids):
            break

        if not all_done or len(results) < len(run_ids):
            time.sleep(POLL_INTERVAL)

    # Final summary
    print_header("WORKFLOW RESULTS")
    all_passed = True
    for wf, run_id in run_ids.items():
        conclusion = results.get(wf, "unknown")
        icon = "✅" if conclusion == "success" else ("⚠️" if conclusion == "skipped" else "❌")
        url = f"https://github.com/{GH_REPO}/actions/runs/{run_id}"
        print(f"  {icon} {wf:<40} {conclusion:<12}  {url}")
        if conclusion not in ("success", "skipped"):
            all_passed = False

    return all_passed


# ─────────────────────────────────────────────────────────
# Step 6 — Download artifacts
# ─────────────────────────────────────────────────────────

def download_artifacts():
    print_header("STEP 6 — Downloading Artifacts")

    if not gh_available() or not check_gh_auth():
        print_warn("GitHub CLI not available — cannot download artifacts automatically")
        print_info(f"Download manually from: https://github.com/{GH_REPO}/actions")
        return

    artifacts_dir = os.path.join(REPO_ROOT, "ci-artifacts")
    os.makedirs(artifacts_dir, exist_ok=True)

    # Download security reports
    out, _, rc = run(
        f'gh run download --repo {GH_REPO} -n security-reports -D "{artifacts_dir}/security-reports"',
        check=False
    )
    if rc == 0:
        print_ok(f"Security reports downloaded to: ci-artifacts/security-reports/")
    else:
        print_warn("Could not download security-reports artifact (may not be ready yet)")

    # Download E2E results
    out, _, rc = run(
        f'gh run download --repo {GH_REPO} -n selenium-e2e-results -D "{artifacts_dir}/e2e-results"',
        check=False
    )
    if rc == 0:
        print_ok(f"E2E test results downloaded to: ci-artifacts/e2e-results/")
    else:
        print_warn("Could not download selenium-e2e-results artifact (may not be ready yet)")

    print_info(f"\n  All artifacts: https://github.com/{GH_REPO}/actions")


# ─────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────

def main():
    print("\n" + "█" * 72)
    print("█  AUTO-PUSH AGENT — Smart Parking Security & E2E Pipeline         █")
    print("█" * 72)
    print(f"\n  Repo root : {REPO_ROOT}")
    print(f"  Remote    : https://github.com/{GH_REPO}")
    print(f"  Branch    : {BRANCH}")
    print(f"  Time      : {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

    try:
        preflight()
        has_changes = stage_files()

        if not has_changes:
            print_info("Nothing new to push — all files are already on GitHub")
            print_info(f"View actions: https://github.com/{GH_REPO}/actions")
            sys.exit(0)

        sha = commit()
        push()
        all_passed = monitor_workflows(sha)
        download_artifacts()

        print_header("DONE")
        if all_passed:
            print_ok("All workflows passed! ✅")
        else:
            print_warn("Some workflows failed — check the links above")

        print(f"""
  📊 Report Links:
     GitHub Actions  →  https://github.com/{GH_REPO}/actions
     Security Review →  https://github.com/{GH_REPO}/blob/main/Vulnerability%20Test%20Results/security-review.md
     E2E Live App    →  https://Viru-6281.github.io/spic-pdd/
     E2E Reports     →  https://Viru-6281.github.io/spic-pdd/reports/latest/execution-report.html
        """)

    except KeyboardInterrupt:
        print("\n\n  ⚡ Monitoring stopped by user (workflows are still running on GitHub)")
        print(f"  View progress: https://github.com/{GH_REPO}/actions\n")
        sys.exit(0)


if __name__ == "__main__":
    main()
