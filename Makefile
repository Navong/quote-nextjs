# Configurations
BRANCH_NAME ?= v2
START_DATE ?= "2024-10-01T12:00:00" # Start date for the first commit
NUMBER_OF_COMMITS ?= 10
INCREMENT ?= "+10 minutes" # Increment time by 10 minutes per commit

# Modify the date of the first N commits, incrementing by 10 minutes
update-commit-dates:
	@echo "Updating dates for the first $(NUMBER_OF_COMMITS) commits starting from $(START_DATE) with a $(INCREMENT) increment..."
	@git rebase --root -i && \
	commit_date="$(START_DATE)"; \
	for i in $(shell seq 1 $(NUMBER_OF_COMMITS)); do \
		commit_date=$$(date -u -d "$$commit_date $(INCREMENT)" '+%Y-%m-%dT%H:%M:%S'); \
		export GIT_COMMITTER_DATE="$$commit_date" && \
		export GIT_AUTHOR_DATE="$$commit_date"; \
		git commit --amend --no-edit --date="$$commit_date"; \
		git rebase --continue || break; \
	done

# Force push to remote branch
push-force:
	@echo "Force pushing changes to remote branch: $(BRANCH_NAME)..."
	@git push origin $(BRANCH_NAME) --force

# Reset branch to match remote
reset-to-remote:
	@echo "Resetting branch $(BRANCH_NAME) to match remote..."
	@git fetch origin
	@git reset --hard origin/$(BRANCH_NAME)

# Help documentation
help:
	@echo "Available targets:"
	@echo "  update-commit-dates - Change dates of the first N commits with incremental times"
	@echo "  push-force          - Force push changes to remote branch"
	@echo "  reset-to-remote     - Reset the local branch to match remote"
