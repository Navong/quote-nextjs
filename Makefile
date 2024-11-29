# Configurations
BRANCH_NAME ?= main
NUMBER_OF_COMMITS ?= 1
NEW_DATE ?= "2025-01-01T12:00:00"
NEW_MESSAGE ?= "Updated commit message"

# Change commit date using rebase
change-date:
	@echo "Changing the date for the last $(NUMBER_OF_COMMITS) commit(s)..."
	@git rebase -i HEAD~$(NUMBER_OF_COMMITS)

# Amend the current commit date
amend-date:
	@echo "Amending the date for the latest commit to $(NEW_DATE)..."
	@git commit --amend --no-edit --date=$(NEW_DATE)

# Change commit message using rebase
change-message:
	@echo "Changing the message for the last $(NUMBER_OF_COMMITS) commit(s)..."
	@git rebase -i HEAD~$(NUMBER_OF_COMMITS)

# Amend the current commit message
amend-message:
	@echo "Amending the message for the latest commit to: $(NEW_MESSAGE)"
	@git commit --amend -m "$(NEW_MESSAGE)"

# Push changes to remote (forcefully)
push-force:
	@echo "Force pushing changes to remote branch: $(BRANCH_NAME)..."
	@git push origin $(BRANCH_NAME) --force

# Reset branch to match remote
reset-to-remote:
	@echo "Resetting branch $(BRANCH_NAME) to match remote..."
	@git fetch origin
	@git reset --hard origin/$(BRANCH_NAME)

# Update date for all commits (use with caution)
update-all-dates:
	@echo "Updating all commit dates to $(NEW_DATE) (use with caution)..."
	@git filter-branch --env-filter \
	'export GIT_AUTHOR_DATE=$(NEW_DATE) \
	export GIT_COMMITTER_DATE=$(NEW_DATE)' -- --all

# Clean up refs after filter-branch
clean-filter-refs:
	@echo "Cleaning up refs after filter-branch..."
	@git for-each-ref --format="%(refname)" refs/original | xargs -n 1 git update-ref -d
	@git reflog expire --expire=now --all
	@git gc --prune=now --aggressive

# Help documentation
help:
	@echo "Available targets:"
	@echo "  change-date         - Interactively change commit dates for the last N commits"
	@echo "  amend-date          - Amend the current commit with a new date"
	@echo "  change-message      - Interactively change commit messages for the last N commits"
	@echo "  amend-message       - Amend the current commit with a new message"
	@echo "  push-force          - Force push changes to remote branch"
	@echo "  reset-to-remote     - Reset the local branch to match remote"
	@echo "  update-all-dates    - Update dates for all commits (use with caution)"
	@echo "  clean-filter-refs   - Clean up references after filter-branch"
