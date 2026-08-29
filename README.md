# luci-app-tempmonitor

`luci-app-tempmonitor` collecte les températures du processeur et des puces
Wi-Fi exposées par Linux dans `hwmon` ou `thermal_zone`, puis les envoie à
`collectd`. Les courbes sont affichées dans **Statistiques → Graphiques →
Températures**.

La vue des graphiques propose les périodes **2 heures**, **1 jour**, **1
semaine**, **1 mois** et **1 an**. Le choix effectué avec « Afficher la période »
est enregistré dans `luci_statistics.rrdtool.default_timespan` : il reste donc
sélectionné après une déconnexion de LuCI ou un redémarrage du routeur. Cette
correction s'applique à tous les graphiques de `luci-app-statistics`, pas
uniquement aux températures.

Le paquet a été conçu pour le Banana Pi BPI-R3 (`mediatek/filogic`, OpenWrt
25.12), mais ne contient aucune liste de chemins propre à cette carte. Il
découvre les capteurs à chaque collecte et fonctionne donc aussi sur d'autres
appareils OpenWrt qui exposent leurs températures via sysfs.

## Capteurs pris en charge

- CPU/SoC : noms `hwmon` ou zones thermiques contenant notamment `cpu`, `soc`,
  `package`, `coretemp` ou `k10temp` ;
- Wi-Fi : pilotes et noms contenant notamment `wifi`, `wlan`, `phy`, `mt76`,
  `mt79`, `ath`, `iwlwifi`, `brcm` ou `rtl` ;
- autres capteurs `hwmon` en option.

Le collecteur utilise le type standard `temperature` de collectd. Il ne charge
aucun module noyau, n'écrit pas dans sysfs et n'agit pas sur le contrôle
thermique de l'appareil.

## Construction

Copier le dépôt dans le SDK OpenWrt, par exemple sous
`package/luci-app-tempmonitor`, puis lancer :

```sh
make menuconfig
# sélectionner LuCI > Applications > luci-app-tempmonitor
make package/luci-app-tempmonitor/compile V=s
```

Le paquet produit est indépendant de l'architecture (`all`/`noarch`). Pour les
versions OpenWrt utilisant `opkg`, la sortie est un `.ipk`; pour celles utilisant
APK, la sortie est un `.apk`.

## Réglages

La page **Statistiques → Températures** permet de régler :

- l'activation générale ;
- la période de collecte (30 secondes par défaut) ;
- la collecte CPU ;
- la collecte Wi-Fi ;
- la collecte facultative des autres capteurs `hwmon`.

Les mêmes valeurs sont disponibles dans `/etc/config/tempmonitor`.

La mémorisation de la période remplace uniquement l'action de la page
**Statistiques → Graphiques**. Aucun fichier appartenant à
`luci-app-statistics` n'est écrasé : la désinstallation de ce paquet restaure
automatiquement la page d'origine.

## Diagnostic

Pour vérifier la découverte sans attendre collectd :

```sh
/usr/libexec/collectd/tempmonitor --once
```

Chaque ligne `PUTVAL` correspond à une température trouvée. Après installation,
les fichiers RRD sont créés à la première collecte dans le répertoire configuré
par `luci-app-statistics` (généralement `/tmp/rrd`).
