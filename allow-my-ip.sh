#!/usr/bin/env bash
# Point the prod security group's SSH rule at this machine's current public IP.
# Run this when deploy-prod.sh times out because the home ISP address changed.
set -euo pipefail

SG="sg-04e44a26783caea7b"
MY_IP="$(curl -s https://checkip.amazonaws.com)/32"

OLD=$(aws ec2 describe-security-groups --group-ids "$SG" \
  --query 'SecurityGroups[0].IpPermissions[?FromPort==`22`].IpRanges[].CidrIp' --output text)

if [[ "$OLD" == "$MY_IP" ]]; then
  echo "SSH already allowed from $MY_IP"
  exit 0
fi

aws ec2 authorize-security-group-ingress --group-id "$SG" \
  --ip-permissions "IpProtocol=tcp,FromPort=22,ToPort=22,IpRanges=[{CidrIp=$MY_IP,Description=home}]" >/dev/null
for cidr in $OLD; do
  aws ec2 revoke-security-group-ingress --group-id "$SG" --protocol tcp --port 22 --cidr "$cidr" >/dev/null
done

echo "SSH now allowed from $MY_IP (removed: ${OLD:-none})"
