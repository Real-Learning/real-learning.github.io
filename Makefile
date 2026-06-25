help:
	@cat Makefile

lint: stylelint

format: styleformat

dev:
	npm run dev

build:
	npm run build

preview: build
	npm run preview

stylelint:
	npx stylelint "src/styles/**/*.css"

styleformat:
	npx stylelint "src/styles/**/*.css" --fix

# all commands here are always to be executed, so all are marked as phony
.PHONY: $(MAKECMDGOALS)
