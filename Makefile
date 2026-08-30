include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-tempmonitor
PKG_VERSION:=1.1.1
PKG_RELEASE:=1

PKG_LICENSE:=Apache-2.0
PKG_MAINTAINER:=Alexis

LUCI_TITLE:=LuCI CPU and Wi-Fi Temperature Monitor
LUCI_DESCRIPTION:=Collects CPU and Wi-Fi chip temperatures, displays them in LuCI Statistics and remembers the selected graph timespan.
LUCI_DEPENDS:=+luci-base +luci-app-statistics +collectd-mod-exec
LUCI_PKGARCH:=all

define Package/$(PKG_NAME)/conffiles
/etc/config/tempmonitor
endef

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
