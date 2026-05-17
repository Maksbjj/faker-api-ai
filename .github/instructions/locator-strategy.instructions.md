---
applyTo: '**'
---

# Locator Generation Strategy

## **Priority Order for Locators:**

When creating page object locators, **always try semantic Playwright locators first**, then CSS selectors, and only use XPath when CSS is not possible.

### **1. Semantic Roles — Highest Priority**

Use `page.getByRole()` whenever the element has an ARIA role. This is the most resilient and readable selector.

```typescript
this.loginButton = page.getByRole('button', { name: 'Login', exact: false })
this.columnHeaders = page.getByRole('columnheader')
this.filterList = page.getByRole('listbox', { name: 'Filter List' })
this.startDateInput = page.getByRole('textbox', { name: 'Start' })
```

### **2. Label / Accessible Name**

Use `page.getByLabel()` for inputs associated with a label element.

```typescript
this.searchInput = page.getByLabel('Search')
```

### **3. Placeholder Text**

Use `page.getByPlaceholder()` for inputs that have a placeholder but no accessible name.

```typescript
this.inputUserName = page.getByPlaceholder('Username')
this.inputPassword = page.getByPlaceholder('Password')
```

### **4. Text Content**

Use `page.getByText()` for static labels, headings, or text-only elements.

```typescript
this.headerText = page.getByText('Dashboard')
```

### **5. Test IDs**

Use `page.getByTestId('element-id')` for elements with an `id` attribute **only when no semantic locator is possible**.

```typescript
this.environmentLabel = page.getByTestId('environmentLabel')
this.titleBarLogo = page.getByTestId('titleBarLogo')
```

### **6. CSS Selectors**

Use CSS selectors when no semantic locator is available. Prefer stable attributes over class names.

```typescript
this.banner = page.locator('[data-type="notification"]')
this.closeIcon = page.locator('button[aria-label="close"]')
```

### **7. XPath — Last Resort**

Use only when CSS is not sufficient — e.g. selecting a parent, or matching on text not accessible via CSS.

```typescript
this.container = page.locator('//div[@data-section="main"]')
```

## **❌ Avoid These Patterns:**

```typescript
// Brittle CSS class selectors
this.submitButton = page.locator('.submit-button-class')

// Complex XPath without stable attributes
this.element = page.locator('//div[1]/span[2]/button[3]')

// Using attribute selectors instead of getByRole
this.headers = page.locator('[role="columnheader"]') // use getByRole instead
this.options = page.locator('[role="option"]') // use getByRole instead
this.input = page.locator('[aria-label="Search"]') // use getByRole or getByLabel instead
```

**Rule: semantic locators → CSS → XPath. Always check for an ARIA role before reaching for CSS or XPath.**
