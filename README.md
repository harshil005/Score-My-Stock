# ScoreMyStock Overview

## Why?

Investing in the stock market can feel like a high-stakes guessing game, especially for those who lack access to professional-level resources. Confusing financial language, nonsensical graphs, and hype creates barriers that make it difficult for everyday investors to make confident decisions. Too often, individuals rely on speculation, social media trends, or incomplete information, leading to costly mistakes and thousands of missed opportunities.

**ScoreMyStock** is designed to change that. Our mission is to empower individual investors with a simple, transparent, and objective way to evaluate stocks. By leveraging data-driven scoring systems and sentiment-based factors (possibly), ScoreMyStock distills market noise into a clear, easy-to-understand score.

With ScoreMyStock, investing becomes more about informed decision-making and less about guesswork. Whether you’re a beginner looking to buy your first stock, or an experienced investor trying to add another tool to their arsenal, ScoreMyStock puts professional-grade insights into your hands.

Our goal is simple: leveling the playing field.

## What?

### What it is and what it is not

**It is:**
- An informational website that provides companies’ fundamental key performance indicators (KPIs) to value investing analysis, intended for investments in the long run.
- A transparent system that features an overall score based on a fundamental analysis of the company’s KPI.

**It is not:**
- An informational app that provides data for day trading and technical analysis.
- A tool that speculates price changes of companies in the short run.

### Key Personas

**Steve User**: A user that accesses the website and types in the company he wants to analyze.

### User Stories

**Interface Engagement:**
- As Steve User, I want to open the app and see a visually engaging input field, as well as a brief description of the app’s behavior after I type a company.

**Comparison Between Companies:**
- As Steve User, I want to compare the KPI of this company with the KPI of other companies. I can do that by clicking an Add button under the current company.

**Comparison Between Years:**
- As Steve User, I want to compare a certain KPI with previous years to see the evolution of the indicator.

**Transparency of Score:**
- As Steve User, I want to click on a “Score Calculation” button that takes me to another page that contains the explanation of how the score is calculated.

## How?

### Architecture Overview

#### Frontend:
- Built using React and TypeScript, paired with Tailwind CSS for rapid, responsive UI development.

#### Backend:
- Built with FastAPI to handle API requests efficiently.

#### Data Processing & Scoring Module:

- **Data Aggregation**: Connects to reliable financial data sources to pull both real-time and historical information.
- **KPI Computation**: Transforms raw financial figures into standardized KPIs (e.g., revenue growth, profit margins, debt ratios).
- **Scoring Algorithm**: Applies a transparent, weighted formula to combine individual KPIs into a single, objective score.
- **Documentation**: Each step in the score calculation is logged and can be reviewed in detail on the “Score Calculation” page.

#### Containerization & Deployment:
- Docker is used to ensure consistency across different environments.

#### Data Storage:

- **Database**: A PostgreSQL database is used to store company fundamentals, historical KPI data, and user interactions.

### Page Components and Widgets

- **Home Page**:
  - Company Input Field
  - Autocomplete Dropdown
  - About Section

- **Score Dashboard**:
  - Score Summary Widget
  - Score Calculation Details
  - Comparison Module

- **Company Analysis Page**:
  - KPI Display Widgets
  - Historical Trends Viewer

### Models

#### Company:
- `symbol` (e.g., AAPL)
- `name`
- `sector`

#### KPI:
- `company_id` (foreign key)
- `metric` (e.g., P/E ratio, revenue growth)
- `value`
- `timestamp` (for historical data)

#### Score:
- `company_id`
- `score_value`
- `weightings`

#### Comparison:
- `company_ids` (array of Companies)
- `selected_kpis` (array of KPIs)

### Score Calculation Module

- **Data Aggregation**: Collects up-to-date and historical financial metrics from trusted APIs.
- **KPI Analysis**: Processes raw data into standardized KPIs that form the foundation of the analysis.
- **Weighted Scoring Algorithm**: Applies predetermined weights to each KPI based on its long-term investment relevance.
- Combines these weighted factors into a single, objective score that reflects the company’s overall investment potential.

### API Routes

### Testing Strategy

- **Unit Testing**
- **Integration Testing**
- **User Acceptance Testing**
- **Performance Testing**
