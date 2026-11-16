# Playwright TypeScript Web Automation Framework

A scalable, maintainable, and enterprise-grade Web Automation Framework built on top of **Playwright** and **TypeScript**, targeting [Tricentis Demo Web Shop](https://demowebshop.tricentis.com/).

---

## 🚀 Key Framework Features

- **Strict Page Object Model (POM)**: Pure POM pattern with dedicated class files for each web page under `pages/` with private elements and action methods.
- **Data-Driven Testing (JSON Store)**: Decoupled JSON data sets in `test-data/users.json` supporting 4 valid and 4 invalid user test iterations.
- **Authentication Caching (`storageState`)**: Automatically self-heals by verifying/registering test users via `tests/auth.setup.ts` and caching clean cookies to `.auth/user.json`.
- **Dependency Injection via Custom Fixtures**: Zero boilerplate in tests using `test.extend` in `fixtures/test.fixture.ts` for clean page injection.
- **Allure Reporting (BDD Hierarchy)**: Native integration with `allure-playwright` and `allure-js-commons` providing clear **Epic ➔ Feature ➔ Story** and unified **Suite ➔ SubSuite** hierarchies with zero raw runner clutter.
- **CI/CD Ready**: Configured GitHub Actions workflow (`.github/workflows/playwright.yml`) archiving both Playwright HTML and Allure reports.

---

## 📁 Directory Structure

```text
playwright_web_framework/
├── .auth/                        # Cached browser session storageState (gitignored)
│   └── user.json
├── .github/
│   └── workflows/
│       └── playwright.yml        # GitHub Actions CI workflow
├── config/
│   ├── categories.json           # Allure defect categorization
│   ├── config.json               # Base URL, timeouts, and execution settings
│   └── env.config.ts             # Typed configuration module
├── fixtures/
│   └── test.fixture.ts           # Custom test.extend injecting all Page Objects
├── pages/                        # Strict Page Object Model (private elements)
│   ├── base.page.ts              # BasePage with resilient action wrappers
│   ├── home.page.ts              # Home page actions, search, navigation
│   ├── login.page.ts             # Login page locators and actions
│   ├── register.page.ts          # Registration page form and validation
│   ├── catalog.page.ts           # Category and search results listing
│   ├── cart.page.ts              # Shopping cart page and terms acceptance
│   └── checkout.page.ts          # Accordion checkout flow (Billing -> Confirm)
├── test-data/                    # JSON-based test data store
│   ├── users.json                # 4 Valid Users & 4 Invalid User Scenarios
│   ├── products.json             # 5 Products for data-driven search
│   └── checkout.json             # 3 Checkout scenarios (3, 1, 2 products each with own billing address)
├── tests/
│   ├── auth.setup.ts             # Ensures valid accounts exist & generates storageState
│   ├── auth/
│   │   ├── login-valid.spec.ts   # 4 Data-driven valid user login tests
│   │   ├── login-invalid.spec.ts # 4 Data-driven invalid credential tests
│   │   └── register.spec.ts      # Dynamic user registration test
│   ├── catalog/
│   │   └── search.spec.ts        # 5 Data-driven product search tests
│   └── e2e/
│       └── checkout.spec.ts      # 3 Data-driven checkout tests (3, 1, 2 products)
├── utils/
│   ├── data-helper.ts            # Dynamic test data generator
│   └── allure-helper.ts          # Typed Allure metadata helper
├── package.json
├── playwright.config.ts          # Central test runner configuration & project matrix
├── tsconfig.json                 # TypeScript compiler configuration with path aliases
└── README.md
```

---

## 🧪 Running Tests

### Tag-Based Execution
| Command | Description |
| :--- | :--- |
| `npm run test:smoke` | Run critical path smoke tests (`@smoke`) |
| `npm run test:regression` | Run regression test suite (`@regression`) |
| `npm run test:negative` | Run negative validation scenarios (`@negative`) |
| `npm run test:positive` | Run positive authentication tests (`@positive`) |

### Module / Suite Execution
| Command | Description |
| :--- | :--- |
| `npm test` | Run full test suite across 4 workers |
| `npm run test:auth` | Run only Authentication tests (Login, Invalid, Register) |
| `npm run test:catalog` | Run only Catalog & Product Search tests |
| `npm run test:e2e` | Run only End-to-End Order Checkout tests |

### Developer & Debugging Modes
| Command | Description |
| :--- | :--- |
| `npm run test:headed` | Run tests in visible headed browser windows |
| `npm run test:ui` | Open interactive Playwright UI mode with time-travel |
| `npm run test:debug` | Run tests step-by-step with Playwright Inspector |
| `npm run test:failed` | Re-run only tests that failed in the previous run |
| `npm run test:ci` | Run in CI mode with retries enabled |
| `npm run typecheck` | Run TypeScript strict type verification (`tsc --noEmit`) |

---

## Allure Report

 <img width="1439" height="667" alt="image" src="https://github.com/user-attachments/assets/5c655818-eebd-4efb-8d95-926d97b55e52" />

 <img width="1437" height="663" alt="image" src="https://github.com/user-attachments/assets/c4b3f619-879c-499e-a3e6-6a2f61296226" />


## 📊 Viewing Reports

### Allure Report

```bash
# Run tests and open Allure report in one step:
npm run test:allure

# Or generate and open manually:
npm run allure:generate && npm run allure:open

# Or serve live:
npm run allure:serve
```

### Playwright HTML Report

```bash
npm run report:html
```

---

## 🧹 Cleaning Previous Reports & Artifacts

To remove all previous execution reports (`allure-results`, `allure-report`, `playwright-report`, and `test-results`):

```bash
npm run clean:reports
# or simply:
npm run clean
```
