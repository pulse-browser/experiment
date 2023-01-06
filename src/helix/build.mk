# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

PROJECT_DIR = helix

package:
	@$(MAKE) -C $(PROJECT_DIR)/installer

package-compare:
	@$(MAKE) -C $(PROJECT_DIR)/installer package-compare

stage-package:
	@$(MAKE) -C $(PROJECT_DIR)/installer stage-package

install::
	@$(MAKE) -C $(PROJECT_DIR)/installer install

source-package::
	@$(MAKE) -C $(PROJECT_DIR)/installer source-package

upload::
	@$(MAKE) -C $(PROJECT_DIR)/installer upload

source-upload::
	@$(MAKE) -C $(PROJECT_DIR)/installer source-upload

hg-bundle::
	@$(MAKE) -C $(PROJECT_DIR)/installer hg-bundle

wget-en-US:
	$(MAKE) -C $(PROJECT_DIR)/locales wget-en-US

merge-% post-merge-% installers-% langpack-% chrome-%:
	$(MAKE) -C $(PROJECT_DIR)/locales $@

#ifdef ENABLE_TESTS
#include $(PROJECT_DIR)/testsuite-targets.mk
#endif
