# Markdownlint Error Solutions Reference

This file documents common markdownlint errors and their solutions for future reference.

## Common Markdownlint Errors and Solutions

### MD022 - Headings should be surrounded by blank lines
**Error**: Headings should be surrounded by blank lines [Expected: 1; Actual: 0; Below]
**Solution**: Add a blank line before and after all headings (##, ###, ####, etc.)

**Before:**
```markdown
Some text
### Heading
- List item
```

**After:**
```markdown
Some text

### Heading

- List item
```

### MD032 - Lists should be surrounded by blank lines
**Error**: Lists should be surrounded by blank lines
**Solution**: Add a blank line before and after all lists

**Before:**
```markdown
### Heading
- List item
- Another item
### Next Heading
```

**After:**
```markdown
### Heading

- List item
- Another item

### Next Heading
```

### MD031 - Fenced code blocks should be surrounded by blank lines
**Error**: Fenced code blocks should be surrounded by blank lines
**Solution**: Add a blank line before and after code blocks

**Before:**
```markdown
### Heading
```bash
command
```
### Next Heading
```

**After:**
```markdown
### Heading

```bash
command
```

### Next Heading
```

### MD024 - Multiple headings with the same content
**Error**: Multiple headings with the same content
**Solution**: Make headings unique by adding descriptive words

**Before:**
```markdown
### User Experience
- Item 1

### User Experience
- Item 2
```

**After:**
```markdown
### User Experience Design
- Item 1

### User Experience Metrics
- Item 2
```

### MD009 - Trailing spaces
**Error**: Trailing spaces [Expected: 0 or 2; Actual: 1]
**Solution**: Remove trailing spaces from lines

**Before:**
```markdown
Line with trailing space 
```

**After:**
```markdown
Line with trailing space
```

### MD047 - Files should end with a single newline character
**Error**: Files should end with a single newline character
**Solution**: Ensure the file ends with exactly one newline character

**Command to fix:**
```bash
echo "" >> filename.md
```

## Quick Fix Commands

### Fix all common markdownlint issues in a file:
```bash
# Add blank lines around headings and lists
sed -i '' 's/^### /\
### /g' filename.md
sed -i '' 's/^#### /\
#### /g' filename.md

# Add trailing newline
echo "" >> filename.md
```

### Check markdownlint errors:
```bash
npx markdownlint filename.md
```

### Auto-fix markdownlint errors (where possible):
```bash
npx markdownlint --fix filename.md
```

## Prevention Tips

1. **Always add blank lines around headings** - This is the most common error
2. **Add blank lines around lists** - Both before and after
3. **Add blank lines around code blocks** - Before and after fenced code blocks
4. **Use unique heading names** - Avoid duplicate headings in the same document
5. **Remove trailing spaces** - Most editors can show these
6. **End files with a single newline** - Standard practice for text files

## Tools and Extensions

- **VS Code**: Install "markdownlint" extension for real-time linting
- **CLI**: Use `npx markdownlint` for command-line checking
- **Pre-commit hooks**: Add markdownlint to pre-commit hooks to catch errors early

## Configuration

Create a `.markdownlint.json` file to customize rules:

```json
{
  "MD013": false,
  "MD033": false,
  "MD041": false
}
```

This reference was created after fixing 69 markdownlint errors in the `doc-features.md` file.
