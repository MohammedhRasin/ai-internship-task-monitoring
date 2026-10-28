import { TaskItem } from '../types';

export const INITIAL_TASKS: TaskItem[] = [
  // Month 1: Excel Basics
  {
    id: 'task-1',
    weekNumber: 1,
    monthNumber: 1,
    skill: 'Excel Basics',
    title: 'Clean Messy Sales Data & Remove Duplicates',
    description: 'Import a raw retail sales dataset, standardize date formats, strip whitespace, remove exact duplicate rows, and fix broken currency values.',
    deliverableRequirements: 'Submit cleaned Excel workbook (.xlsx) or CSV containing: 1) Cleaned Transactions sheet, 2) Data Validation summary sheet documenting removed duplicates and standardized columns.',
    evaluationRubric: 'Completeness of duplicate removal (25%), date consistency (25%), zero formula errors like #VALUE (25%), professional formatting (25%).'
  },
  {
    id: 'task-2',
    weekNumber: 2,
    monthNumber: 1,
    skill: 'Excel Basics',
    title: 'Core Business Formulas (VLOOKUP, XLOOKUP, INDEX/MATCH)',
    description: 'Enrich product transaction records with customer demographics and regional pricing using lookup functions.',
    deliverableRequirements: 'Excel sheet using XLOOKUP or INDEX-MATCH to merge customer master data with order items. Include error-handling wrappers (IFERROR).',
    evaluationRubric: 'Correct lookup keys (30%), dynamic formula ranges (30%), proper handling of missing records (20%), documentation (20%).'
  },
  {
    id: 'task-3',
    weekNumber: 3,
    monthNumber: 1,
    skill: 'Excel Basics',
    title: 'Logical & Conditional Calculations (IF, SUMIFS, COUNTIFS)',
    description: 'Calculate multi-condition revenue aggregates, regional tiering, and performance commissions across store branches.',
    deliverableRequirements: 'Workbook with automated summary tables using SUMIFS, COUNTIFS, and nested IF/IFS functions for quarterly bonus tiers.',
    evaluationRubric: 'Logical formula accuracy (35%), dynamic cell referencing (35%), clear KPI cards (30%).'
  },
  {
    id: 'task-4',
    weekNumber: 4,
    monthNumber: 1,
    skill: 'Excel Basics',
    title: 'Data Sorting, Advanced Filtering & Quality Checklist',
    description: 'Build an automated filtering checklist and conditional formatting heatmaps to flag high-risk anomalies and outliers in inventory levels.',
    deliverableRequirements: 'Interactive Excel sheet with custom number formatting, color scales for stock levels, and automated filter views.',
    evaluationRubric: 'Visual clarity (30%), correct conditional rules (40%), written summary of findings (30%).'
  },

  // Month 2: Excel Advanced
  {
    id: 'task-5',
    weekNumber: 5,
    monthNumber: 2,
    skill: 'Excel Advanced',
    title: 'Dynamic Pivot Tables & Slicers',
    description: 'Build multidimensional pivot tables analyzing sales by category, channel, and fiscal quarter with interactive slicers.',
    deliverableRequirements: 'Excel workbook with at least 3 linked pivot tables and interactive slicers (Year, Region, Category) with calculated fields.',
    evaluationRubric: 'Pivot table architecture (30%), calculated field accuracy (35%), user UX/slicer cohesion (35%).'
  },
  {
    id: 'task-6',
    weekNumber: 6,
    monthNumber: 2,
    skill: 'Excel Advanced',
    title: 'Executive Chart Design & Data Visualization',
    description: 'Transform tabular aggregates into executive-ready combination charts, trend lines, and waterfall budget comparisons.',
    deliverableRequirements: 'A dedicated visual sheet featuring combo charts (Bar + Line for target vs actual), clean typography, and zero chartjunk.',
    evaluationRubric: 'Chart appropriateness (40%), visual hierarchy (30%), annotations and callouts (30%).'
  },
  {
    id: 'task-7',
    weekNumber: 7,
    monthNumber: 2,
    skill: 'Excel Advanced',
    title: 'Automating Cleaning with Power Query',
    description: 'Use Excel Power Query (Get & Transform) to ingest multiple CSV files, unpivot monthly columns, and load into a normalized data model.',
    deliverableRequirements: 'M-Query transformation steps documented or applied workbook demonstrating unpivoted columns and automated refresh capability.',
    evaluationRubric: 'Transformation efficiency (40%), robust unpivoting (30%), refresh repeatability without manual fixes (30%).'
  },
  {
    id: 'task-8',
    weekNumber: 8,
    monthNumber: 2,
    skill: 'Excel Advanced',
    title: 'First Interactive Executive Excel Dashboard',
    description: 'Assemble an all-in-one executive KPI dashboard with top-line cards, month-over-month variances, and drill-down capabilities.',
    deliverableRequirements: 'A single-tab polished executive dashboard sheet with grid layout, synchronized slicers, and a 200-word business summary.',
    evaluationRubric: 'Layout & spacing (30%), analytical depth (35%), responsiveness to filters (35%).'
  },

  // Month 3: SQL Basics
  {
    id: 'task-9',
    weekNumber: 9,
    monthNumber: 3,
    skill: 'SQL Basics',
    title: 'Database Setup & Core SELECT / WHERE Queries',
    description: 'Connect to a relational database, write queries filtering ecommerce orders by status, date intervals, and price thresholds.',
    deliverableRequirements: 'SQL script (.sql) with at least 8 commented queries demonstrating SELECT, WHERE, LIKE, IN, BETWEEN, and NULL checks.',
    evaluationRubric: 'Query syntax & correctness (40%), proper indexing/filter logic (30%), SQL code formatting & comments (30%).'
  },
  {
    id: 'task-10',
    weekNumber: 10,
    monthNumber: 3,
    skill: 'SQL Basics',
    title: 'Aggregation with GROUP BY & HAVING Clauses',
    description: 'Aggregate customer purchases to find top spenders, average order values by country, and categories exceeding $50k in total sales.',
    deliverableRequirements: 'SQL script demonstrating COUNT, SUM, AVG, MIN, MAX with GROUP BY and filtering grouped results using HAVING.',
    evaluationRubric: 'Correct aggregation logic (40%), accurate HAVING vs WHERE usage (40%), result set accuracy (20%).'
  },
  {
    id: 'task-11',
    weekNumber: 11,
    monthNumber: 3,
    skill: 'SQL Basics',
    title: 'Data Transformation with CASE WHEN & String Functions',
    description: 'Categorize customer lifetime tiers (Bronze, Silver, Gold), extract domains from email addresses, and format currency text.',
    deliverableRequirements: 'Queries utilizing CASE WHEN conditions, SUBSTRING/SPLIT_PART, CONCAT, and COALESCE on real-world datasets.',
    evaluationRubric: 'Robustness of conditional buckets (40%), string parsing accuracy (30%), NULL handling (30%).'
  },
  {
    id: 'task-12',
    weekNumber: 12,
    monthNumber: 3,
    skill: 'SQL Basics',
    title: 'Month 3 Review: SQL Analytical Problem Set',
    description: 'Solve 5 business case questions (retention rate, monthly active buyers, cancellation drivers) using pure SQL aggregation.',
    deliverableRequirements: 'SQL solutions file answering all 5 prompt questions with explanation of business insights gained.',
    evaluationRubric: 'Correct business logic (40%), query performance (30%), analytical reasoning (30%).'
  },

  // Month 4: SQL Advanced
  {
    id: 'task-13',
    weekNumber: 13,
    monthNumber: 4,
    skill: 'SQL Advanced',
    title: 'Mastering Relational Joins (INNER, LEFT, FULL, CROSS)',
    description: 'Merge orders, customer profiles, shipping carriers, and returns tables while preserving unfulfilled orders.',
    deliverableRequirements: 'SQL script with multi-table joins (3+ tables), verifying row count integrity and preventing duplicate multiplication.',
    evaluationRubric: 'Correct join types chosen (40%), prevention of Cartesian products (30%), clear aliases (30%).'
  },
  {
    id: 'task-14',
    weekNumber: 14,
    monthNumber: 4,
    skill: 'SQL Advanced',
    title: 'Subqueries & Common Table Expressions (CTEs)',
    description: 'Refactor complex nested queries into readable WITH cte AS (...) modular blocks to find above-average basket sizes.',
    deliverableRequirements: 'SQL file featuring at least 3 queries rewritten using CTEs and correlated subqueries with before/after commentary.',
    evaluationRubric: 'Readability & modularity (40%), CTE logic (40%), documentation (20%).'
  },
  {
    id: 'task-15',
    weekNumber: 15,
    monthNumber: 4,
    skill: 'SQL Advanced',
    title: 'Analytical Window Functions (ROW_NUMBER, RANK, DENSE_RANK)',
    description: 'Rank top selling products within each category, and identify each customer’s first and second purchase dates.',
    deliverableRequirements: 'Queries utilizing PARTITION BY and ORDER BY clauses for ROW_NUMBER, RANK, and DENSE_RANK.',
    evaluationRubric: 'Partitioning correctness (40%), handling ranking ties (30%), query performance (30%).'
  },
  {
    id: 'task-16',
    weekNumber: 16,
    monthNumber: 4,
    skill: 'SQL Advanced',
    title: 'Time-Series & Running Totals (LAG, LEAD, Running SUM)',
    description: 'Calculate 7-day moving averages of daily revenue, month-over-month growth percentage, and customer churn intervals.',
    deliverableRequirements: 'SQL script calculating running revenue totals and LAG/LEAD day-over-day growth rates.',
    evaluationRubric: 'Window frame specification (40%), growth % calculation (30%), edge-case boundary handling (30%).'
  },

  // Month 5: Python Basics
  {
    id: 'task-17',
    weekNumber: 17,
    monthNumber: 5,
    skill: 'Python Basics',
    title: 'Python Syntax, Variables & Data Structures',
    description: 'Write Python programs utilizing lists, dictionaries, tuples, and sets to store and process survey responses.',
    deliverableRequirements: 'Python script (.py or .ipynb) demonstrating dictionary lookups, list comprehensions, and data transformations.',
    evaluationRubric: 'Code correctness (35%), pythonic idioms / list comprehensions (35%), clean comments (30%).'
  },
  {
    id: 'task-18',
    weekNumber: 18,
    monthNumber: 5,
    skill: 'Python Basics',
    title: 'Control Flow, Loops & Conditionals',
    description: 'Process batch records using for/while loops, enumerate, and error handling (try/except) on missing inputs.',
    deliverableRequirements: 'Python script parsing batch transaction lists, flagging fraud anomalies with conditional rules and exception handling.',
    evaluationRubric: 'Flow control logic (40%), defensive try/except handling (30%), efficiency (30%).'
  },
  {
    id: 'task-19',
    weekNumber: 19,
    monthNumber: 5,
    skill: 'Python Basics',
    title: 'Modular Functions & Scripting',
    description: 'Refactor procedural code into reusable functions with type annotations, docstrings, and default parameters.',
    deliverableRequirements: 'Python module with at least 4 documented functions for metric conversion, currency rounding, and string sanitization.',
    evaluationRubric: 'Function reusability (35%), docstring quality (35%), unit test or assert checks (30%).'
  },
  {
    id: 'task-20',
    weekNumber: 20,
    monthNumber: 5,
    skill: 'Python Basics',
    title: 'File I/O & Working with CSV/JSON Data',
    description: 'Read and write local files using Python’s native open(), csv, and json libraries without external dependencies.',
    deliverableRequirements: 'A script that ingests a nested JSON API response file, extracts pertinent attributes, and writes a normalized CSV file.',
    evaluationRubric: 'Safe file handle management with context managers (with open) (40%), JSON parsing (30%), output validity (30%).'
  },

  // Month 6: Python for Analysis (Pandas & NumPy)
  {
    id: 'task-21',
    weekNumber: 21,
    monthNumber: 6,
    skill: 'Python for Analysis',
    title: 'NumPy Arrays & Vectorized Computations',
    description: 'Create multi-dimensional NumPy arrays, perform broadcasting, calculate standard deviations and matrix operations.',
    deliverableRequirements: 'Jupyter notebook demonstrating vectorized math without loops, comparison of performance vs standard Python lists.',
    evaluationRubric: 'Vectorization correctness (40%), speedup profiling (30%), clarity of documentation (30%).'
  },
  {
    id: 'task-22',
    weekNumber: 22,
    monthNumber: 6,
    skill: 'Python for Analysis',
    title: 'Pandas DataFrames: Loading, Indexing & Filtering',
    description: 'Load a 100k-row dataset into Pandas, inspect dtypes, use .loc/.iloc, and filter rows by compound boolean conditions.',
    deliverableRequirements: 'Notebook loading dataset, displaying shape/info/describe, and filtering records with chained boolean masks.',
    evaluationRubric: 'Efficient indexing (35%), avoidance of chained assignment warnings (35%), memory optimization (30%).'
  },
  {
    id: 'task-23',
    weekNumber: 23,
    monthNumber: 6,
    skill: 'Python for Analysis',
    title: 'Data Cleaning, Imputation & Type Casting in Pandas',
    description: 'Handle missing values (.dropna, .fillna), string sanitization (.str accessor), and datetime conversions (.to_datetime).',
    deliverableRequirements: 'Data cleaning pipeline function that takes dirty data, imputes missing values with median/mode, and standardizes formats.',
    evaluationRubric: 'Handling nulls appropriately (40%), datetime feature engineering (30%), repeatable pipeline design (30%).'
  },
  {
    id: 'task-24',
    weekNumber: 24,
    monthNumber: 6,
    skill: 'Python for Analysis',
    title: 'Groupby, Aggregation & Pivot Tables in Pandas',
    description: 'Group customer records by acquisition channel, calculate aggregate statistics, and reshape with .pivot_table() and .melt().',
    deliverableRequirements: 'Notebook generating multi-index group statistics and pivoted summary matrices with named aggregation.',
    evaluationRubric: 'Named aggregation syntax (40%), reshaping accuracy (30%), insights commentary (30%).'
  },

  // Month 7: Data Visualization
  {
    id: 'task-25',
    weekNumber: 25,
    monthNumber: 7,
    skill: 'Data Visualization',
    title: 'Exploratory Plotting with Matplotlib',
    description: 'Create customizable subplots, histograms, scatter plots, and bar charts using the Matplotlib object-oriented API.',
    deliverableRequirements: 'Script generating a 2x2 grid of publication-quality subplots with customized titles, tick labels, and legends.',
    evaluationRubric: 'Object-oriented API usage (fig, ax) (40%), labeling and scale choice (30%), aesthetic cleanliness (30%).'
  },
  {
    id: 'task-26',
    weekNumber: 26,
    monthNumber: 7,
    skill: 'Data Visualization',
    title: 'Statistical Visualizations with Seaborn',
    description: 'Generate box plots, violin plots, correlation heatmaps, and pairplots to discover relationships between continuous variables.',
    deliverableRequirements: 'Seaborn notebook including an annotated correlation matrix and facet grid visual across demographic categories.',
    evaluationRubric: 'Color palette accessibility (30%), statistical relevance (40%), interpretation of distributions (30%).'
  },
  {
    id: 'task-27',
    weekNumber: 27,
    monthNumber: 7,
    skill: 'Data Visualization',
    title: 'Visual Storytelling & Anti-Chartjunk Principles',
    description: 'Redesign a cluttered, misleading corporate chart into a high-impact graphic following Edward Tufte and Cole Nussbaumer Knaflic principles.',
    deliverableRequirements: 'Side-by-side comparison of "Before" vs "After" chart with written rationale explaining every eliminated element.',
    evaluationRubric: 'Data-to-ink ratio improvement (40%), focal point clarity (30%), storytelling justification (30%).'
  },
  {
    id: 'task-28',
    weekNumber: 28,
    monthNumber: 7,
    skill: 'Data Visualization',
    title: 'Interactive Web Visualizations with Plotly',
    description: 'Build interactive hoverable charts, time-series range sliders, and drill-down treemaps using Plotly Express.',
    deliverableRequirements: 'HTML export or notebook containing an interactive Plotly dashboard with custom hover tooltips and dynamic filters.',
    evaluationRubric: 'Tooltip design (35%), interactivity smoothness (35%), responsiveness (30%).'
  },

  // Month 8: Power BI Basics
  {
    id: 'task-29',
    weekNumber: 29,
    monthNumber: 8,
    skill: 'Power BI Basics',
    title: 'Data Ingestion & Transformation in Power Query',
    description: 'Connect Power BI Desktop to Excel and SQL sources, merge queries, handle data types, and load into the internal VertiPaq engine.',
    deliverableRequirements: 'PBIX file or exported report screenshots demonstrating cleaned dimensional tables and removal of redundant source columns.',
    evaluationRubric: 'Data source parameterization (30%), clean column naming (35%), star schema readiness (35%).'
  },
  {
    id: 'task-30',
    weekNumber: 30,
    monthNumber: 8,
    skill: 'Power BI Basics',
    title: 'Star Schema Dimensional Data Modeling',
    description: 'Design a Kimball-style star schema separating Fact sales tables from Dim Customer, Dim Product, and Dim Date tables with 1-to-many relationships.',
    deliverableRequirements: 'Model view diagram screenshot showing single-directional 1:* relationships, surrogate keys, and a dedicated Calendar table.',
    evaluationRubric: 'Relationship direction & cardinality (40%), avoidance of bi-directional filters (30%), star schema purity (30%).'
  },
  {
    id: 'task-31',
    weekNumber: 31,
    monthNumber: 8,
    skill: 'Power BI Basics',
    title: 'Core Report Visuals & Card Layouts',
    description: 'Configure standard Power BI visuals: Matrix tables, clustered column charts, donut charts, and new Card (preview) metrics.',
    deliverableRequirements: 'Two-page Power BI report with consistent color palette, aligned visual containers, and cross-highlighting enabled.',
    evaluationRubric: 'Visual alignment & theme cohesion (35%), cross-filtering effectiveness (35%), metric clarity (30%).'
  },
  {
    id: 'task-32',
    weekNumber: 32,
    monthNumber: 8,
    skill: 'Power BI Basics',
    title: 'Bookmarks, Drill-Throughs & Tooltip Pages',
    description: 'Implement dynamic UX features: custom hover tooltip report pages, drill-through to individual transaction details, and bookmark navigation.',
    deliverableRequirements: 'Report demonstrating a functional "Clear Filters" button, a custom tooltip visual, and drill-through action.',
    evaluationRubric: 'UX responsiveness (40%), bookmark reliability (30%), business utility of drill-through (30%).'
  },

  // Month 9: Power BI Advanced (DAX)
  {
    id: 'task-33',
    weekNumber: 33,
    monthNumber: 9,
    skill: 'Power BI Advanced',
    title: 'Calculated Columns vs Measures in DAX',
    description: 'Understand evaluation context (Row Context vs Filter Context) and create reusable explicit DAX measures.',
    deliverableRequirements: 'PBIX file with a dedicated _Measures table containing base measures (Total Revenue, Total Cost, Profit Margin %).',
    evaluationRubric: 'Use of explicit measures over columns (40%), measure formatting (30%), context explanation (30%).'
  },
  {
    id: 'task-34',
    weekNumber: 34,
    monthNumber: 9,
    skill: 'Power BI Advanced',
    title: 'CALCULATE & Filter Modification Modifiers',
    description: 'Write advanced DAX expressions utilizing CALCULATE, FILTER, ALL, ALLEXCEPT, and REMOVEFILTERS to compute market share percentages.',
    deliverableRequirements: 'DAX scripts calculating % of Total Category Sales and % of All Store Revenue regardless of current visual filters.',
    evaluationRubric: 'Filter context manipulation (45%), syntax cleanliness (30%), performance efficiency (25%).'
  },
  {
    id: 'task-35',
    weekNumber: 35,
    monthNumber: 9,
    skill: 'Power BI Advanced',
    title: 'Time Intelligence DAX Functions',
    description: 'Calculate Year-to-Date (TOTALYTD), Same Period Last Year (SAMEPERIODLASTYEAR), and Year-over-Year revenue variance percentage.',
    deliverableRequirements: 'Report page displaying YoY growth matrix and line chart tracking trailing 12-month (T12M) rolling revenue.',
    evaluationRubric: 'Correct Date table dependency (40%), YoY variance formula (40%), handling incomplete months (20%).'
  },
  {
    id: 'task-36',
    weekNumber: 36,
    monthNumber: 9,
    skill: 'Power BI Advanced',
    title: 'End-to-End Enterprise Power BI Dashboard',
    description: 'Deliver an executive SaaS or Retail analytics dashboard ready for C-suite presentation, with automated alerts and KPI cards.',
    deliverableRequirements: 'Multi-page Power BI dashboard with mobile layout view, documentation tab, and performance analyzer audit log.',
    evaluationRubric: 'Business impact (35%), DAX complexity (35%), design consistency & mobile layout (30%).'
  },

  // Month 10: Statistics
  {
    id: 'task-37',
    weekNumber: 37,
    monthNumber: 10,
    skill: 'Statistics',
    title: 'Descriptive Statistics & Summary Measures',
    description: 'Calculate mean, median, mode, variance, standard deviation, interquartile range (IQR), and skewness on customer spending.',
    deliverableRequirements: 'Statistical analysis report in Python or Excel showing five-number summary and skewness interpretation.',
    evaluationRubric: 'Calculation accuracy (40%), interpretation of mean vs median for skewed data (40%), reporting clarity (20%).'
  },
  {
    id: 'task-38',
    weekNumber: 38,
    monthNumber: 10,
    skill: 'Statistics',
    title: 'Probability Distributions & Central Limit Theorem',
    description: 'Simulate Normal, Binomial, and Poisson distributions in Python; demonstrate how sample means converge via the Central Limit Theorem.',
    deliverableRequirements: 'Jupyter notebook simulating 10,000 trials of dice or customer arrivals, graphing the sampling distribution of the mean.',
    evaluationRubric: 'Simulation code rigor (40%), graphical explanation (35%), written takeaways (25%).'
  },
  {
    id: 'task-39',
    weekNumber: 39,
    monthNumber: 10,
    skill: 'Statistics',
    title: 'Hypothesis Testing & Confidence Intervals',
    description: 'Formulate Null and Alternative hypotheses, compute 95% confidence intervals, and interpret p-values for marketing click-through rates.',
    deliverableRequirements: 'Documented one-sample and two-sample t-test results in Python (scipy.stats) with explicit accept/reject decisions.',
    evaluationRubric: 'Hypothesis formulation (35%), correct test selection (35%), business interpretation of p-values (30%).'
  },
  {
    id: 'task-40',
    weekNumber: 40,
    monthNumber: 10,
    skill: 'Statistics',
    title: 'A/B Test Design & Evaluation',
    description: 'Evaluate conversion rates between landing page Variant A and Variant B using a two-proportion z-test, calculating sample size and power.',
    deliverableRequirements: 'A/B testing executive deck/summary with sample size calculation, statistical significance, and launch recommendation.',
    evaluationRubric: 'Statistical rigor (40%), handling type I / type II errors (30%), practical business recommendation (30%).'
  },

  // Month 11: Statistics + Storytelling
  {
    id: 'task-41',
    weekNumber: 41,
    monthNumber: 11,
    skill: 'Statistics + Storytelling',
    title: 'Correlation vs Causation & Confounding Variables',
    description: 'Analyze Pearson and Spearman correlation coefficients and investigate hidden confounders (Simpson’s Paradox).',
    deliverableRequirements: 'Analytical memo detailing an apparent correlation and demonstrating how subgroup segmentation reverses the conclusion.',
    evaluationRubric: 'Understanding of Simpson’s paradox (45%), data visualization (30%), logical rigor (25%).'
  },
  {
    id: 'task-42',
    weekNumber: 42,
    monthNumber: 11,
    skill: 'Statistics + Storytelling',
    title: 'Linear Regression Modeling & Coefficient Interpretation',
    description: 'Fit an Ordinary Least Squares (OLS) regression model to predict sales from advertising spend; evaluate R-squared and p-values.',
    deliverableRequirements: 'Python statsmodels output table with line-by-line interpretation of the intercept, slope coefficient, and R-squared.',
    evaluationRubric: 'Regression assumptions check (residuals, homoscedasticity) (40%), interpretation accuracy (40%), clarity (20%).'
  },
  {
    id: 'task-43',
    weekNumber: 43,
    monthNumber: 11,
    skill: 'Statistics + Storytelling',
    title: 'Multiple Regression & Collinearity Diagnostics',
    description: 'Build a multiple regression model with multi-variable predictors, evaluate Variance Inflation Factor (VIF), and remove multicollinearity.',
    deliverableRequirements: 'Notebook evaluating feature importance, VIF scores, adjusted R-squared, and train-test validation splits.',
    evaluationRubric: 'Collinearity diagnostics (40%), feature selection rationale (30%), predictive evaluation (30%).'
  },
  {
    id: 'task-44',
    weekNumber: 44,
    monthNumber: 11,
    skill: 'Statistics + Storytelling',
    title: 'Executive Presentation: The Narrative Arc',
    description: 'Craft a 10-slide executive pitch deck transforming technical data findings into an action-oriented narrative for non-technical executives.',
    deliverableRequirements: 'Slide deck (PDF/Slides link) with Situation-Complication-Resolution framework, bold headlines, and clear next steps.',
    evaluationRubric: 'Executive narrative flow (40%), slide visual hygiene (35%), business ROI justification (25%).'
  },

  // Month 12: Final Capstone Project (Weeks 45-48)
  {
    id: 'task-45',
    weekNumber: 45,
    monthNumber: 12,
    skill: 'Final Capstone Project',
    title: 'Capstone Part 1: Dataset Selection & 3 Business Questions',
    description: 'Select an authentic enterprise dataset (e.g. Kaggle, BigQuery Public Data), define 3 core business questions, and write project charter.',
    deliverableRequirements: 'Project Charter document containing: 1) Problem Statement, 2) Dataset schema & origin, 3) Three hypothesis-driven business questions, 4) Success metrics.',
    evaluationRubric: 'Business question clarity (40%), dataset viability (30%), scope realism (30%).',
    isFinalProject: true
  },
  {
    id: 'task-46',
    weekNumber: 46,
    monthNumber: 12,
    skill: 'Final Capstone Project',
    title: 'Capstone Part 2: Data Cleaning & Exploratory Analysis (SQL / Python)',
    description: 'Conduct deep data wrangling and exploratory data analysis (EDA) using either SQL or Python, validating every column and finding anomalies.',
    deliverableRequirements: 'Reproducible script or Jupyter notebook containing data pipeline, null imputation, distribution checks, and key correlation findings.',
    evaluationRubric: 'Code cleanliness and documentation (35%), depth of exploratory findings (35%), robust handling of edge-cases (30%).',
    isFinalProject: true
  },
  {
    id: 'task-47',
    weekNumber: 47,
    monthNumber: 12,
    skill: 'Final Capstone Project',
    title: 'Capstone Part 3: Interactive Dashboard Development',
    description: 'Build a polished, interactive dashboard in Power BI, Tableau, or Plotly/Streamlit addressing the 3 core business questions.',
    deliverableRequirements: 'Live dashboard link or file with cohesive branding, dynamic drill-throughs, and clear KPI summaries answering the project hypotheses.',
    evaluationRubric: 'Visual hierarchy and UX (35%), analytical depth answering the 3 questions (40%), interactivity (25%).',
    isFinalProject: true
  },
  {
    id: 'task-48',
    weekNumber: 48,
    monthNumber: 12,
    skill: 'Final Capstone Project',
    title: 'Capstone Part 4: Executive Report & Final Defense Presentation',
    description: 'Author a comprehensive final report and present your findings in a recorded or live defense session with your mentor.',
    deliverableRequirements: 'Final Deliverable Package: 1) Executive 5-page PDF report with actionable recommendations, 2) Presentation slide deck, 3) GitHub repo link with clean code.',
    evaluationRubric: 'Strategic recommendations & ROI (40%), presentation defense quality (30%), technical artifact completeness (30%).',
    isFinalProject: true
  }
];
