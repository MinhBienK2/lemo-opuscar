#!/bin/sh
# Rebuild the rig catalog: rig/catalog/{props,people,assets}-N.jpg and CATALOG.md. Run from the library root:
#   sh channels/tram-nghi-nhieu/rig/catalog/build.sh
set -e
D=channels/tram-nghi-nhieu/rig/catalog
for kv in $(node $D/catalog.mjs); do
  set=${kv%=*}; n=${kv#*=}; ts=""; i=0
  while [ $i -lt $n ]; do ts="$ts $i.3"; i=$((i + 1)); done
  tmp=$(mktemp -d)
  node core/render/still.mjs $D $ts --q "show=$set" --out "$tmp" >/dev/null
  rm -f $D/$set-*.jpg
  i=0; while [ $i -lt $n ]; do mv "$tmp/t_$i.3.jpg" "$D/$set-$((i + 1)).jpg"; i=$((i + 1)); done
  rmdir "$tmp"
  echo "$set: $n pages"
done
echo "$D/CATALOG.md"
