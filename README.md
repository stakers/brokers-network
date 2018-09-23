# brokers-network
Smart contracts for Brokers

### Important Considerations
- Composer and Fabric version is `0.19.14` and should be kept that way for now.
- The business network on Hyperledger is called `brokers-net`

### Build, Install & Start the network
You can make changes to the chaincode, you'll need to rebuild, install and restart the network for those changes to take effect. You can create and publish different versions of the chaincode to your business network.

```
// If you don't have a .bna file, build one:
composer archive create -t dir -n contracts/brokers-network -a contracts/dist/brokers-network.bna

// Use the admin card to install and start a business network
composer network install -c adminCard -a ./contracts/dist/brokers-net.bna

// start
composer network start -c adminCard -n brokers-network -V 0.0.1 -A admin -C ./credentials/admin-pub.pem -f delete_me.card
````
