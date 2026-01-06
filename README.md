# NHK Purchase Web Admin

## Table Of Content

- [NHK Purchase Web Admin](#nhk-purchase-web-admin)
  - [Table Of Content](#table-of-content)
  - [Dev Note --MUST READ--](#dev-note---must-read--)
  - [Technologies](#technologies)
  - [Project Structure Overview](#project-structure-overview)
  - [Requests / API Calling](#requests--api-calling)
    - [API Directory](#api-directory)
  - [Styling](#styling)
    - [Naming CSS Module Files](#naming-css-module-files)
    - [Class Naming Convention](#class-naming-convention)
    - [CSS Module Plugin](#css-module-plugin)
    - [Responsive Design & Using @media](#responsive-design--using-media)
    - [Design System and How to Use It](#design-system-and-how-to-use-it)
    - [Example of Implementing CSS Modules](#example-of-implementing-css-modules)
  - [Routing](#routing)
    - [The Route Hierachy](#the-route-hierachy)
  - [Side Menu](#side-menu)
  - [Permissions](#permissions)
  - [Implementation Guide](#implementation-guide)
    - [Adding a New Feature](#adding-a-new-feature)
    - [Adding a New Route & Permission For Your New Feature](#adding-a-new-route--permission-for-your-new-feature)
  - [Commit Message Convention](#commit-message-convention)
    - [Structure of a Preferred Commit Message](#structure-of-a-preferred-commit-message)
    - [Example Commit Messages:](#example-commit-messages)
    - [Key Elements:](#key-elements)
    - [Common Icons and Their Meaning:](#common-icons-and-their-meaning)
    - [List Of Icons and Their Types:](#list-of-icons-and-their-types)

### Dev Note --MUST READ--

#### Development Guidelines

##### 1. Date Handling

- Always use `<CustomDatePicker />` component for date inputs
- For date-related operations, refer to `dateHelpers.ts`
- When sending dates to the server, use Local format: `2024-09-15T00:00:00`

##### 2. Modal Implementation

Use two boolean flags for proper modal mounting/unmounting:

```typescript
{isSomeModalMounted && (
  <SomeModal
    isOpen={isModalOpen}
    onClose={handleClose}
    afterClose={handleAfterClose}
    // ... other props
  />
)}
```

This ensures the modal only mounts when needed, improving performance.
Reference: See implementation in `src/features/purchaseRequisition/PurchaseRequisitionPage.tsx`

##### 3. Notifications

Use the `useNotification` hook for consistent notification handling:

```typescript
const { openNotification } = useNotification()

// Usage
openNotification({
  type: 'success', // or 'error', 'warning', 'info'
  title: 'Action Completed',
  description: 'Operation was successful',
})
```

Reference: See implementation details in `src/contexts/NotificationContext.tsx`

##### 4. Don't do download file in RTK Query

Reference: https://github.com/reduxjs/redux-toolkit/issues/1522
Just use pure fetch to do download, please look into `src/api/attachmentApi.ts`

##### 5. Currency to Text Conversion

For converting numerical amounts to text representation:

```typescript
// For Thai Baht with proper Baht and Satang handling
import { toThaiCurrencyWords } from 'utils/toWordsHelper'

const amount = 1234567.89
const words = toThaiCurrencyWords(amount)
// Output: "One Million Two Hundred Thirty Four Thousand Five Hundred Sixty Seven Baht And Eighty Nine Satang"

// For Thai Baht in Thai language
import ThaiBahtText from 'thai-baht-text'

const thaiWords = ThaiBahtText(1234567.89)
// Output: "หนึ่งล้านสองแสนสามหมื่นสี่พันห้าร้อยหกสิบเจ็ดบาทแปดสิบเก้าสตางค์"
```

### Known Issues

- PDF Render Issue: ["Expected null or instance of Config, got an instance of Config"](https://github.com/diegomura/react-pdf/issues/2892)
- Warning: [antd: Upload] value is not a valid prop: https://github.com/ant-design/ant-design/issues/46235
- [17/Feb/2025] Warning: Return type is option instead of Option instance. Please read value directly instead of reading from `props`. => Still don't know the root cause and how it might effect the app but right now it's working fine. Already look into it once.

## Technologies

- React
- TypeScript
- Redux
- RTK Query
- Ant Design (antd)
- ECharts, ECharts for React
- Storybook
- CSS Modules


## Project Structure Overview

1. **src/api**: Contains all the api.
2. **src/app**: Contains the Redux store and global slices.
3. **src/assets**: Store all assets such as images, icons, and SVG files.
4. **src/components**: Includes shared components used across features.
5. **src/config**: Contains configuration files about environment (env).
6. **src/constants**: Contains shared constants.
7. **src/contexts**: Contains global contexts.
8. **src/features**: Houses all features of the project.
9. **src/hooks**: Contains custom shared hooks.
10. **src/routes**: Manages all routes and page layouts.
11. **src/styles**: Contains global styles, CSS overrides, design tokens, and themes.
12. **src/utils**: Includes global utility helpers.

## Requests / API Calling

The project uses `RTK Query` for making and managing API requests. For more information, refer to the [RTK Query documentation](https://redux-toolkit.js.org/rtk-query/overview).

#### API Directory

All API files should be placed in the `src/api` directory. Create a separate file for each API domain. For example, the API related to users should be named `userApi.ts`, and the one related to products should be named `productsApi.ts`.

## Styling

The project uses Ant Design with theming managed via `ConfigProvider` (`src/styles/theme.ts`) and primarily employs CSS Modules for styling.
For more details on CSS Modules, refer to [this guide](https://www.barbarianmeetscoding.com/notes/css-modules/).

#### Naming CSS Module Files

Create CSS module files with the same name as their corresponding component, e.g., for `LoginPage.tsx`, name the CSS Module file `LoginPage.module.css`.

#### Class Naming Convention

Although CSS Modules typically use ~~`camelCase`~~, this project uses **`kebab-case`** for class names. Please follow this convention for consistency.

#### CSS Module Plugin

Currently, we use 3 PostCSS plugins:

1. **autoprefixer**: Automatically adds vendor prefixes to CSS properties, ensuring cross-browser compatibility.
2. **postcss-custom-media**: Allows the use of custom media queries in CSS, making it easier to manage breakpoints and responsive design.
3. **postcss-preset-env**: Enables the use of modern CSS features by converting them into more widely supported syntax based on your target browsers.

You can check the configuration in `postcss.config.cjs`.

#### Responsive Design & Using @media

For detailed information on breakpoints, refer to `src/styles/breakpoints.module.css`. Follow the steps below to use the predefined breakpoints:

1. **Import the `breakpoints.module.css` file** into your component's CSS Module.
   Example:

   ```css
   @import 'styles/breakpoints.module.css';
   ```

2. **Apply custom media queries** in your component's CSS file.  
   Example:
   ```css
   @media (--xs-viewport) {
     /* Your CSS code here */
   }
   ```

#### Design System and How to Use It

You can use color variables and other design tokens from `src/styles/design-tokens.css`. Here's how:

1. **In CSS files**, simply use the variable like this:
   ```css
   var(--variable-name)
   ```
2. **In JavaScript/TypeScript files**, you can access CSS variables by importing the color variables from `src/styles/theme.ts`. For reference, check how it's used in `src/features/purchaseRequisition/components/PRBudgetControlSheet/BCSTable.tsx`.

If you need a new color that is not in the `src/styles/design-tokens.css` file, please add the new color variable there. Always use color variables—**do not use hardcoded colors**. This ensures that if we need to apply a new theme, we can easily update the values in the design token file.

#### Example of Implementing CSS Modules

You can refer to `src/components/PageHeader/PageHeader.module.css` for an example of how CSS Modules are used in this project.

## Routing

You can refer to the `src/routes/index.tsx` file to see all the routes in the project. This file imports routes from two other files:

1. `src/routes/menuRoutes.tsx`
2. `src/routes/subRoutes.tsx`

When adding new routes to the project:

- Add paths to `menuRoutes` if the route should be displayed in the side menu.
- All other routes should be added to `subRoutes`.

Each new route must include a `requiredPermission` for role-based access control.

For routes that are accessible to everyone without any permission, you can add them directly to `src/routes/index.tsx`.

#### The Route Hierachy

To ensure the **correct expansion** of the menu to its active children, the `key` must follow a hierarchical structure. For instance, in the side-menu where we have 'Posts' with two children, 'Car Posts' and 'House Posts', the key should be structured as follows:

- [Posts] `key: '/posts'`
  - [Car Posts] `key: '/posts/cars'`
  - [House Posts] `key: '/posts/house'`

You'll notice that both "Car Posts" and "House Posts" need to have '/posts' included in their `key` property. This setup is crucial for the menu expansion to function correctly based on the key structure.

The reason behind this is how Ant Design's menu manages the `key` of open menus in the form of an array of `key`. We want the menu to <u>expand accordingly</u> **when a user inputs a URL in the browser and accesses that page**. To achieve this, we need to split the path and set it in the open menu array.

## Side Menu

We need to render only the authorized menu items and hide all others. The structured menu items are stored in `src/components/SideMenu/sideMenuItems.tsx`. Since we utilize the menu component from Ant Design, the menu structure will conform to Ant Design's requirements but will also include our custom properties, as such:

```json
[{
  label: 'Posts',
  icon: <TeamOutlined />,
  key: '/posts',
  children: [
    {
      label: 'Car Posts',
      icon: <SolutionOutlined />,
      key: '/posts/cars',
      permission: 'A050009',
    },
  ],
}]
```

`label`, `icon`, `key`, and `children` are the properties defined by Ant Design for the menu. You can refer to their documentation for more details. However, we've also added our own property, which is `permission`.
Let me elaborate a bit more on the details of each property.

- `label`: This represents the text that will be displayed in the UI.
- `icon`: This is an optional property.
- `key`: The `key` serves as the **route** used for navigating to that menu item.
- `permission`: This is the `code` that corresponds with the `requiredPermission` in routes. For the menu to <u>appear</u>, its permission must be found in the `Permissions` topic (The detail is in [Permissions](#permissions)).

Note that the `permission` property, if a menu item is a **parent menu** (meaning it has children), you **DO NOT NEED** to specify the permission for it
If its children have the necessary permission in the `Permissions`, they will automatically add their parent back to the menu. However, if none of the children of that parent are authorized to appear in the menu, then the parent and its children will not show up at all.

## Permissions

The structure of the `permissions` is as follows:

```json
[
  {
    "id": "551019117428948279",
    "name": "PageB",
    "code": "A050028",
    "description": "this is page Description of PageB",
    "elementAccessList": [
      {
        "id": "551019117437337033",
        "elementId": "SEARCH_CPN",
        "elementDescription": "Description of BE1",
        "accessControl": {
          "isEnable": true,
          "isVisible": true
        }
      }
    ]
  }
]
```

The `permissions` contains all the programs that a user can **\*access**, including those that are not displayed on the side-menu menu (for example edit page, detail page etc.)

**\*Access** means:

- ✅ See the menu item in the side-menu menu (if any)
- ✅ Can access that route

The `permissions` object consist of:

- `name`: name of the program
- `code`:
  - Each page should have a **unique** program code
  - If **no program code** is provided in the program list, attempting to access the page will result in a <u>404 or 403 error</u>.
- `description`: brief description of the program
- `elementAccessList`:

  - Contains the list of UI element permissions for each page. It consists of `elementId`, `elementDescription`, and `accessControl`.
  - `accessControl` specifies the permission for whether a UI element is enabled or visible.

  📌📌 **Please note that**, by default, if no `elementAccessList` is provided, the UI element is assumed to be **enabled and visible**. However, if an `elementAccessList` for that UI element is provided, the UI element's status of being enabled or visible will be determined based on the specified permissions. 📌📌

## Implementation Guide

### Adding a New Feature

1. Create a new folder in `src/features` using camelCase (e.g., `login`).
2. Add your page component, using Pascal Case (e.g., `LoginPage.tsx`).
3. If needed, create a CSS file in the same directory as your component, named after the component (e.g., `LoginPage.module.css`), and use kebab-case for class names.
4. Place related components in a subdirectory named `components` within your feature folder (e.g., `src/features/auth/components`). Shared components should go in `src/components`. For each new component, create a new folder and name the main file `index.tsx`. You can also add additional files like stories or CSS modules in this folder.
5. You may add other directories in your feature folder, such as `hooks`, `utils`, or files related to the feature like slices, types, or API files. Refer to the `auth` feature folder (e.g., `src/features/auth`) for an example.

### Adding a New Route & Permission For Your New Feature

1. Prepare your component (see [Adding a New Feature](#adding-a-new-feature) for more details).

2. Add the new route to the project and provide the `requiredPermission`:

   - **`src/routes/menuRoutes.tsx`**: Add the path here if the route should be shown in the side menu.
   - **`src/routes/subRoutes.tsx`**: Add all other routes here.  
     For more details about routing, refer to [Routing](#routing).

3. Update the permissions in **`src/mocks/user.ts`**.  
   For more information about permissions, see [Permissions](#permissions).

4. _(Optional)_ Add a new side menu item in **`src/components/SideMenu/sideMenuItems.tsx`**.  
   For more details, see [Side Menu](#side-menu).

5. Test your route. If it’s not working, review the steps above to ensure all required information has been provided.

## Commit Message Convention

#### Structure of a Preferred Commit Message

```
{icon} {type} [{feature_name} (optional)]: {message}
```

#### Example Commit Messages:

- ✨ feature: add new feature authentication
- ✨ feature [authentication]: add OAuth login
- ⚡ update [authentication]: update OAuth function
- 🐛 fix [user-profile]: correct avatar rendering bug
- 💄 ui [header]: update header style and layout

#### Key Elements:

1. **Icon**:

   - A relevant emoji that visually represents the type of change.
   - Helps quickly identify the nature of the commit at a glance.

2. **Type**:

   - Describes the nature or purpose of the commit.
   - **Should be written in lowercase** to maintain consistency.
   - Common types:
     - `feature`: A new feature or functionality.
     - `fix`: A bug fix or issue resolution.
     - `update`: Modifying or improving an existing feature or functionality.
     - `refactor`: Code restructuring or optimization without changing functionality.
     - `docs`: Documentation changes or updates.
     - `test`: Adding, improving, or fixing tests.
     - `style`: Code style adjustments that do not affect the logic (e.g., formatting changes).
     - `ui`: User interface changes (visual updates).

3. **Feature Name** (optional):

   - Enclosed in square brackets `[ ]` to specify the related feature, module, or section.
   - Helps contextualize the change by indicating which part of the codebase it affects.

4. **Message**:
   - A short, clear description of what the commit does.
   - Should be written in imperative mood (e.g., "add" instead of "added").
   - Avoid ending with a period to keep it consistent and concise.

#### Common Icons and Their Meaning:

- ✨ `feature`: Represents new features.
- 🐛 `fix`: Denotes a bug fix.
- ⚡ `update`: Highlights improvements or changes to existing features.
- ♻️ `refactor`: Code restructuring or optimization.
- 📚 `docs`: Documentation changes.
- 🧪 `test`: Unit or integration test changes.
- 🎨 `style`: Code formatting, indentation, or stylistic changes.
- 💄 `cosmetic`: Cosmetic, UI update.

This convention ensures that commit messages are standardized, informative, and easy to navigate, both visually and through content.

### List Of Icons and Their Types:

| Commit type                | Emoji                                                     |
| :------------------------- | :-------------------------------------------------------- |
| Initial commit             | :tada: `:tada:`                                           |
| Version tag                | :bookmark: `:bookmark:`                                   |
| New feature                | :sparkles: `:sparkles:`                                   |
| Bugfix                     | :bug: `:bug:`                                             |
| Metadata                   | :card_index: `:card_index:`                               |
| Documentation              | :books: `:books:`                                         |
| Documenting source code    | :bulb: `:bulb:`                                           |
| Performance                | :racehorse: `:racehorse:`                                 |
| Cosmetic                   | :lipstick: `:lipstick:`                                   |
| Tests                      | :test_tube: `:test_tube:`                                 |
| General update             | :zap: `:zap:`                                             |
| Improve format/structure   | :art: `:art:`                                             |
| Refactor code              | :recycle: `:recycle:`                                     |
| Removing code/files        | :fire: `:fire:`                                           |
| Continuous Integration     | :green_heart: `:green_heart:`                             |
| Security                   | :lock: `:lock:`                                           |
| Upgrading dependencies     | :arrow_up: `:arrow_up:`                                   |
| Downgrading dependencies   | :arrow_down: `:arrow_down:`                               |
| Lint                       | :shirt: `:shirt:`                                         |
| Translation                | :alien: `:alien:`                                         |
| Text                       | :pencil: `:pencil:`                                       |
| Critical hotfix            | :ambulance: `:ambulance:`                                 |
| Deploying stuff            | :rocket: `:rocket:`                                       |
| Fixing on MacOS            | :apple: `:apple:`                                         |
| Fixing on Linux            | :penguin: `:penguin:`                                     |
| Fixing on Windows          | :checkered_flag: `:checkered_flag:`                       |
| Work in progress           | :construction: `:construction:`                           |
| Adding CI build system     | :construction_worker: `:construction_worker:`             |
| Analytics or tracking code | :chart_with_upwards_trend: `:chart_with_upwards_trend:`   |
| Removing a dependency      | :heavy_minus_sign: `:heavy_minus_sign:`                   |
| Adding a dependency        | :heavy_plus_sign: `:heavy_plus_sign:`                     |
| Docker                     | :whale: `:whale:`                                         |
| Configuration files        | :wrench: `:wrench:`                                       |
| Package.json in JS         | :package: `:package:`                                     |
| Merging branches           | :twisted_rightwards_arrows: `:twisted_rightwards_arrows:` |
| Bad code / need improv.    | :hankey: `:hankey:`                                       |
| Reverting changes          | :rewind: `:rewind:`                                       |
| Breaking changes           | :boom: `:boom:`                                           |
| Code review changes        | :ok_hand: `:ok_hand:`                                     |
| Accessibility              | :wheelchair: `:wheelchair:`                               |
| Move/rename repository     | :truck: `:truck:`                                         |
| Other                      | [Be creative](http://www.emoji-cheat-sheet.com/)          |


### Approve Via Email
#### Success Flow
```
https://epurth.nhkspg.co.th/approval-action
  ?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
  &documentId=12345
  &documentType=PR
  &routeId=789  
```

#### Failure Flow
```
https://epurth.nhkspg.co.th/email-approval-failed
  ?reason=EXPIRED|USED|INVALID|TOKEN_ERROR
  &documentId=12345
  &documentType=PR
  &routeId=789
```
