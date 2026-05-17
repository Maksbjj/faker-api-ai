---
applyTo: '**'
---

# Page Object Pattern

---

## Structure

All page objects live in `src/ui/pages/` and extend a shared `BasePage`. The base provides navigation, title, and URL-wait helpers.

### BasePage

```typescript
// src/ui/pages/base.page.ts
import { Page } from '@playwright/test';

export class BasePage {
  url: string;

  constructor(protected page: Page) {
    this.url = '';
  }

  async goto(parameters = ''): Promise<void> {
    await this.page.goto(`${this.url}${parameters}`);
  }

  async getTitle(): Promise<string> {
    await this.page.waitForLoadState();
    return this.page.title();
  }

  async waitForPageToLoadUrl(): Promise<void> {
    await this.page.waitForURL(this.url);
  }
}
```

### Page Object

```typescript
// src/ui/pages/login.page.ts
import { LoginUserModel } from '@_src/ui/models/user.model';
import { BasePage }       from '@_src/ui/pages/base.page';
import { WelcomePage }    from '@_src/ui/pages/welcome.page';
import { Locator, Page }  from '@playwright/test';

export class LoginPage extends BasePage {
  url = '/login/';

  // Declare locators as class properties
  userEmailInput:    Locator;
  userPasswordInput: Locator;
  loginButton:       Locator;
  loginError:        Locator;

  constructor(page: Page) {
    super(page);
    // Initialize all locators in the constructor
    this.userEmailInput    = this.page.getByPlaceholder('Enter User Email');
    this.userPasswordInput = this.page.getByPlaceholder('Enter Password');
    this.loginButton       = this.page.getByRole('button', { name: 'LogIn' });
    this.loginError        = this.page.getByTestId('login-error');
  }

  async login(loginUserData: LoginUserModel): Promise<WelcomePage> {
    await this.userEmailInput.fill(loginUserData.userEmail);
    await this.userPasswordInput.fill(loginUserData.userPassword);
    await this.loginButton.click();
    return new WelcomePage(this.page);
  }
}
```

---

## View Objects

Views are for modals, dialogs, and inline forms that have no URL of their own. They live in `src/ui/views/` and do **not** extend `BasePage`:

```typescript
// src/ui/views/add-article.view.ts
import { AddArticleModel } from '@_src/ui/models/article.model';
import { ArticlePage }     from '@_src/ui/pages/article.page';
import { Locator, Page }   from '@playwright/test';

export class AddArticleView {
  titleInput:  Locator;
  bodyInput:   Locator;
  saveButton:  Locator;

  constructor(private page: Page) {
    this.titleInput  = page.getByTestId('title-input');
    this.bodyInput   = page.getByTestId('body-text');
    this.saveButton  = page.getByRole('button', { name: 'Save' });
  }

  async createArticle(data: AddArticleModel): Promise<ArticlePage> {
    await this.titleInput.fill(data.title);
    await this.bodyInput.fill(data.body);
    await this.saveButton.click();
    return new ArticlePage(this.page);
  }
}
```

---

## Naming Conventions

### Locators — type-first camelCase

```typescript
// ✅ CORRECT — type describes the element type, descriptor follows
userEmailInput    // input field for user email
loginButton       // button that triggers login
loginError        // error message element
articleTitle      // heading/text showing article title
noResultText      // text shown when no results found
alertPopup        // popup/toast alert element

// ❌ WRONG
emailInput        // descriptor-first
btnLogin          // abbreviated type
el1               // meaningless
```

### Methods — verbNoun camelCase

```typescript
// ✅ CORRECT
async login(data: LoginUserModel): Promise<WelcomePage> { ... }
async clickAddArticleButtonLogged(): Promise<AddArticleView> { ... }
async searchArticle(title: string): Promise<ArticlesPage> { ... }
async deleteArticle(): Promise<ArticlesPage> { ... }
async gotoArticle(title: string): Promise<ArticlePage> { ... }

// ❌ WRONG
async doLogin() { ... }
async articleClick() { ... }
async checkStuff() { ... }
```

---

## Methods That Navigate Must Return a Page Object

If a method click causes navigation to another page, return an instance of that page's class:

```typescript
// ✅ CORRECT
async clickSignInButton(): Promise<SignInPage> {
  await this.signInButton.click();
  return new SignInPage(this.page);
}

// ❌ WRONG — returns void, losing the reference to the new page
async clickSignInButton(): Promise<void> {
  await this.signInButton.click();
}
```

In tests, assign the returned page object and use it:

```typescript
// ✅
const signInPage = await homePage.clickSignInButton();
await signInPage.doSomething();

// ❌ — constructing manually when a method could return it
const signInPage = new SignInPage(page);
await homePage.clickSignInButton();
```

---

## Access Modifiers

Do **not** add explicit `public` or `private` unless required by the implementation:

```typescript
// ✅ CORRECT
class LoginPage extends BasePage {
  loginButton: Locator;
  constructor(page: Page) { ... }
  async login(data: LoginUserModel): Promise<WelcomePage> { ... }
}

// ❌ WRONG
class LoginPage extends BasePage {
  public loginButton: Locator;
  public constructor(public page: Page) { ... }
  public async login(data: LoginUserModel): Promise<WelcomePage> { ... }
}
```

---

## Before Modifying an Existing Page Object

Read the full file before adding anything. Never duplicate existing properties or methods.


### BasePage provides

- `url: string` — override in each subclass
- `goto(parameters?: string): Promise<void>`
- `getTitle(): Promise<string>`
- `waitForPageToLoadUrl(): Promise<void>`

### Required Imports

```typescript
import { Locator, Page } from '@playwright/test';
import { BasePage } from '@_src/ui/pages/base.page';
```

---

## Correct Pattern — Full Example

```typescript
import { LoginUserModel } from '@_src/ui/models/user.model';
import { BasePage }       from '@_src/ui/pages/base.page';
import { WelcomePage }    from '@_src/ui/pages/welcome.page';
import { Locator, Page }  from '@playwright/test';

export class LoginPage extends BasePage {
  url = '/login/';

  // Declare locators as class properties
  userEmailInput:    Locator;
  userPasswordInput: Locator;
  loginButton:       Locator;
  loginError:        Locator;

  constructor(page: Page) {
    super(page);
    // Initialize ALL locators in the constructor
    this.userEmailInput    = this.page.getByPlaceholder('Enter User Email');
    this.userPasswordInput = this.page.getByPlaceholder('Enter Password');
    this.loginButton       = this.page.getByRole('button', { name: 'LogIn' });
    this.loginError        = this.page.getByTestId('login-error');
  }

  async login(loginUserData: LoginUserModel): Promise<WelcomePage> {
    await this.userEmailInput.fill(loginUserData.userEmail);
    await this.userPasswordInput.fill(loginUserData.userPassword);
    await this.loginButton.click();
    return new WelcomePage(this.page);
  }
}
```

---

## Naming Conventions

### Locators — `typeDescriptor` (type first, camelCase)

```typescript
// ✅ CORRECT
userEmailInput    = this.page.getByPlaceholder('Enter User Email');
loginButton       = this.page.getByRole('button', { name: 'LogIn' });
loginError        = this.page.getByTestId('login-error');
articleTitle      = this.page.getByRole('heading');
noResultText      = this.page.getByText('No data');

// ❌ WRONG
emailInput    // (descriptor first)
btnLogin      // (abbreviated type)
loginBtn      // (descriptor first)
el1           // (meaningless)
```

### Methods — `verbNoun` (camelCase)

```typescript
// ✅ CORRECT
async login(data: LoginUserModel): Promise<WelcomePage> { ... }
async clickAddArticleButtonLogged(): Promise<AddArticleView> { ... }
async searchArticle(title: string): Promise<ArticlesPage> { ... }
async deleteArticle(): Promise<ArticlesPage> { ... }
async gotoArticle(title: string): Promise<ArticlePage> { ... }

// ❌ WRONG
async doLogin() { ... }
async articleClick() { ... }
async xyz() { ... }
```

---

## Methods That Navigate Must Return Page Objects

If a method click navigates to another page, return the new page object:

```typescript
// ✅ CORRECT
async clickSignInButton(): Promise<SignInPage> {
  await this.signInButton.click();
  return new SignInPage(this.page);
}

// ❌ WRONG — returns void, caller cannot chain
async clickSignInButton(): Promise<void> {
  await this.signInButton.click();
}
```

Usage in tests:
```typescript
// ✅
const signInPage = await homePage.clickSignInButton();

// ❌ — creating the page object manually when a method could return it
const signInPage = new SignInPage(page);
await homePage.clickSignInButton();
```

---

## Access Modifiers

Do **not** add explicit `public` or `private` modifiers unless strictly necessary for implementation:

```typescript
// ✅ CORRECT
class LoginPage extends BasePage {
  loginButton: Locator;
  constructor(page: Page) { ... }
  async login(data: LoginUserModel): Promise<WelcomePage> { ... }
}

// ❌ WRONG
class LoginPage extends BasePage {
  public loginButton: Locator;
  public constructor(public page: Page) { ... }
  public async login(data: LoginUserModel): Promise<WelcomePage> { ... }
}
```

---

## View Objects

Views are modal/dialog/inline forms that don't have their own URL. They live in `src/ui/views/` and do **not** extend `BasePage`:

```typescript
import { AddArticleModel } from '@_src/ui/models/article.model';
import { ArticlePage }     from '@_src/ui/pages/article.page';
import { Locator, Page }   from '@playwright/test';

export class AddArticleView {
  articleTitleInput: Locator;
  articleBodyInput:  Locator;
  saveButton:        Locator;

  constructor(private page: Page) {
    this.articleTitleInput = page.getByTestId('title-input');
    this.articleBodyInput  = page.getByTestId('body-text');
    this.saveButton        = page.getByRole('button', { name: 'Save' });
  }

  async createArticle(data: AddArticleModel): Promise<ArticlePage> {
    await this.articleTitleInput.fill(data.title);
    await this.articleBodyInput.fill(data.body);
    await this.saveButton.click();
    return new ArticlePage(this.page);
  }
}
```

---

## Before Modifying a Page Object File

Always read the **full existing file** before adding anything. Never duplicate existing properties or methods.
