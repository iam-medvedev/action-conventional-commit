# Conventional commit parser

## Inputs

| Field | Description              | Required | Default    |
| ----- | ------------------------ | -------- | ---------- |
| token | Github token             | ✔        |            |
| major | Labels for major version |          | '[]'       |
| minor | Labels for minor version |          | '["feat"]' |
| patch | Labels for patch version |          | '[]'       |

## Outputs

| Field | Description                     |
| ----- | ------------------------------- |
| label | Parsed commit label             |
| type  | Commit type (major/minor/patch) |

## Example usage

```yml
- name: Parse commit
  uses: iam-medvedev/action-conventional-commit@init
  id: get-label
  with:
    token: ${{ secrets.GITHUB_TOKEN }}

- name: Get latest version
  uses: actions-ecosystem/action-get-latest-tag@v1
  id: get-latest-tag
  with:
    semver_only: true
    with_initial_version: true
    initial_version: v1.0.0

- name: Update version
  uses: actions-ecosystem/action-bump-semver@v1
  id: bump-semver
  with:
    current_version: ${{ steps.get-latest-tag.outputs.tag }}
    label: ${{ steps.get-label.outputs.type }}
```
