# Project Workflow Guide

Welcome to the Project Workflow Guide. This comprehensive document will provide you with a clear and effective workflow for using Git within your projects. By following these guidelines, you'll be able to collaborate seamlessly, manage version control, and contribute effectively to your project. Additionally, this guide will cover best practices for type definition in your project.

## Table of Contents

1. [Introduction](#introduction)
2. [Git Workflow](#git-workflow)
    - [Getting Started](#getting-started)
    - [Creating and Managing Branches](#creating-and-managing-branches)
    - [Making Changes](#making-changes)
    - [Stage and Commit Changes](#stage-and-commit-changes)
    - [Pushing Changes](#pushing-changes)
    - [Creating Pull Requests](#creating-pull-requests)
3. [Pull Request Guidelines](#pull-request-guidelines)
4. [File and Variable Naming Convention](#file-and-variable-naming-convention)
    - [Component File Naming](#component-file-naming)
    - [Other File Naming](#other-file-naming)
    - [Variable Naming](#variable-naming)
    - [Constants Naming](#constants-naming)
5. [Type Definition Guidelines](#type-definition-guidelines)
    - [Using Type Instead of Interface](#using-type-instead-of-interface)
    - [Avoiding Any Type](#avoiding-any-type)
    - [Organizing Types](#organizing-types)
6. [Conclusion](#conclusion)

## Introduction

This document serves as a comprehensive guide for using Git effectively within your projects. It aims to establish a consistent Git workflow, covering topics such as branching, making changes, committing, pushing, and creating pull requests. By adhering to these guidelines, you'll ensure that your codebase remains organized, maintainable, and scalable. Additionally, this guide provides best practices for type definition in your project.

## Git Workflow

### Getting Started

1. Clone the repository to your local machine using:

    ```
    git clone [repository-url]
    ```

2. Configure Git to rebase when pulling changes:

    ```
    git config pull.rebase true [--global]
    ```

3. Pull changes from the main branch:
    ```
    git pull origin main
    ```

### Creating and Managing Branches

-   Create a new branch for each feature or bug fix:

    ```
    git checkout -b [branch-name]
    ```

    Example: `git checkout -b [issue number].[issue title]`

-   Use `git stash` to organize changes when switching branches.

-   Rebase your branch with changes from the main branch:
    ```
    git checkout main
    git pull
    git checkout [branch-name]
    git pull origin main
    ```

### Making Changes

-   Make small, focused commits that address a single issue or feature.

### Stage and Commit Changes

-   Stage changes:

    ```
    git add [file-name]
    ```

-   Commit changes with a meaningful message:
    ```
    git commit -m "[issue number] fix:[commit message]"
    ```

### Pushing Changes

-   Push changes to the remote branch:
    ```
    git push
    ```

### Creating Pull Requests

1. Ensure your branch is up to date with the main branch:

    ```
    git pull --rebase origin main
    ```

2. Create a pull request on GitHub, ensuring to add appropriate reviewers.

3. Address any reviewer comments and make necessary changes.

4. Rebase your branch with changes from the main branch before merging:

    ```
    git pull --rebase origin main
    ```

5. Merge the pull request:

    - Choose "Squash and Merge" to group smaller commits.

6. After merging, rebase your branch again to stay up to date:
    ```
    git pull origin main
    ```

## Pull Request Guidelines

When creating a pull request, please ensure that:

-   PR title follows the commit convention, eg: "EA-[issue number] fix:Update Login Page"
-   Your branch is up to date with the main branch.
-   Changes are fully tested and pass all tests.
-   Commit messages are meaningful and follow the commit guidelines.

## File and Variable Naming Convention

To maintain consistency and readability, please follow the file and variable naming convention:

### Component File Naming

-   Use PascalCase for component file names.
-   Start with an uppercase letter.
-   Example: `Login.js`

### Other File Naming

-   Use lowercase letters and hyphens for other file names.
-   Separate words with hyphens.
-   Example: `login-page.js`

### Variable Naming

-   Use camelCase for variable names.
-   Start with a lowercase letter.
-   Example: `userName`

### Constants Naming

-   Use uppercase letters and underscores for constant names.
-   Separate words with underscores.
-   Example: `MAX_ATTEMPTS`

## Type Definition Guidelines

To ensure type safety and maintainability, please follow the type definition guidelines:

### Using Type Instead of Interface

-   Prefer using `type` instead of `interface` for type definitions.

### Avoiding Any Type

-   Avoid using `any` type whenever possible.
-   Use the appropriate type that accurately represents the data.

### Organizing Types

-   Keep type definitions organized in the `types` folder.

## Conclusion

Congratulations! You have completed the Git Workflow and Type Definition Guide for A2SV Projects. By following these best practices, you contribute to a well-organized, maintainable, and scalable codebase. Before committing your changes, make sure to run `npm run test-all` to run tests, linter, build, and format. If everything works, you are good to go. If you encounter any questions or issues, don't hesitate to reach out to your team leader for assistance. Happy coding!
