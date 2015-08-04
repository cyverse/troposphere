SERVER_URL=$(shell hostname -f)

CERT_DIR=/etc/ssl/certs
CERT_FILE=iplantc.org.crt
CERT_PATH=$(CERT_DIR)/$(CERT_FILE)

COMBINED_CERT_FILE=iplantc_combined.crt
COMBINED_CERT_PATH=$(CERT_DIR)/$(COMBINED_CERT_FILE)

BUNDLE_FILE=gd_bundle.crt
BUNDLE_PATH=$(CERT_DIR)/$(BUNDLE_FILE)

KEY_FILE=iplantc.key
KEY_PATH=/etc/ssl/private/$(KEY_FILE)

TROPOSPHERE_PATH=/opt/dev/troposphere

SITES_AVAILABLE_DIR=/etc/nginx/sites-available
SITES_ENABLED_DIR=/etc/nginx/sites-enabled
LOCATIONS_DIR=/etc/nginx/locations

DHPARAM=/etc/ssl/certs/dhparam.pem
KEY_SIZE=2048

SITE_FILE=site.conf
SITE_CONFIG=$(TROPOSPHERE_PATH)/extras/nginx/$(SITE_FILE)
TROPO_FILE=tropo.conf
TROPO_CONFIG=$(TROPOSPHERE_PATH)/extras/nginx/locations/$(TROPO_FILE)

.PHONY: all clean

all: deploy

copy:
	cp $(SITE_CONFIG).dist $(SITE_CONFIG)
	cp $(TROPO_CONFIG).dist $(TROPO_CONFIG)

$(DHPARAM):
	openssl dhparam -out $(DHPARAM) $(KEY_SIZE)

setup: copy setup-tropo
	sed -i "s#@SERVER_URL#$(SERVER_URL)#g" $(SITE_CONFIG)
	sed -i "s#@COMBINED_CERT_PATH#$(COMBINED_CERT_PATH)#g" $(SITE_CONFIG)
	sed -i "s#@KEY_PATH#$(KEY_PATH)#g" $(SITE_CONFIG)
	sed -i "s#@DHPARAM#$(DHPARAM)#g" $(SITE_CONFIG)

setup-tropo:
	sed -i "s#@TROPOSPHERE_PATH#$(TROPOSPHERE_PATH)#g" $(TROPO_CONFIG)

$(COMBINED_CERT_PATH):
	cat $(CERT_PATH) $(BUNDLE_PATH) > $(COMBINED_CERT_PATH)

deploy: $(COMBINED_CERT_PATH) setup $(DHPARAM) unlink deploy-tropo
	mkdir -p $(SITES_AVAILABLE_DIR)
	mkdir -p $(SITES_ENABLED_DIR)
	ln -fs $(TROPOSPHERE_PATH)/extras/nginx/$(SITE_FILE) $(SITES_AVAILABLE_DIR)/$(SITE_FILE)
	ln -fs $(SITES_AVAILABLE_DIR)/$(SITE_FILE) $(SITES_ENABLED_DIR)/$(SITE_FILE)

deploy-tropo:
	mkdir -p $(LOCATIONS_DIR)
	ln -fs $(TROPO_CONFIG) $(LOCATIONS_DIR)/$(TROPO_FILE)

unlink: unlink-tropo
	-rm $(SITES_ENABLED_DIR)/$(SITE_FILE)
	-rm $(SITES_AVAILABLE_DIR)/$(SITE_FILE)

unlink-tropo:
	-rm $(LOCATIONS_DIR)/$(TROPO_FILE)

test:
	service nginx configtest

restart:
	service nginx restart

clean: unlink
	-rm $(COMBINED_CERT_PATH)
	-rm $(SITE_CONFIG)
	-rm $(TROPO_CONFIG)
	-rm $(DHPARAM)
