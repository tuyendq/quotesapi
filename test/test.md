URL="http://localhost/quotes"
URL2="http://quotesapi-quotes.apps.us-west-1.starter.openshift-online.com/quotes"

curl -X GET $URL/2
curl -X DELETE $URL/2

curl -X POST \
  http://quotesapi-quotes.apps.us-west-1.starter.openshift-online.com/quotes \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/x-www-form-urlencoded' \
  -H 'postman-token: d8ad7acf-c899-19cf-bc02-d263ee6a6ef0' \
  -d 'quote=What%20you%20have%20is%20now.&author=Unknown&year=2019'

curl -X DELETE \
  http://quotesapi-quotes.apps.us-west-1.starter.openshift-online.com/quotes/6

