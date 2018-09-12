var factory = getFactory();
var NS = 'org.eprocess.peerloan';

/**
 * peerloan transaction
 * @param {org.eprocess.peerloan.RequestLoan} offer
 * @transaction
 */
async function RequestLoan(offer) {
    // let listing = offer.listing;
    if (offer.requester.state == 'IN_DEBT') {
        throw new Error('Broker still owes some funds');
    }
    //  if (!listing.offers) {
    //      listing.offers = [];
    //  }
    //  listing.offers.push(offer);

    // save the vehicle listing
    const accountRegistry = await getAssetRegistry('org.eprocess.peerloan.Account');
    await accountRegistry.update(offer.requester);

    return getAssetRegistry(NS + '.Account')
        .then(function(assetRegistry) {
            return assetRegistry.update(offer.requester)

        }).then(function() {

            var event = factory.newEvent(NS, 'RequestLoanVerifier')
            event.duedate = offer.duedate;
            event.amount = offer.amount;
            event.state = offer.state;
            event.requester = offer.requester;
            // event.borrower = offer.borrower;
            emit(event);

        });

}


/**
 * peerloan transaction
 * @param {org.eprocess.peerloan.GrantLoan} offer
 * @transaction
 */
async function GrantLoan(offer) {

    if (offer.lender.balance < offer.amount) {
        throw new Error('Insufficent funds');
    }

    //const balance = offer.asset.balance
    offer.lender.balance -= offer.amount;
    offer.borrower.balance += offer.amount;

    offer.lender.state = 'TO_BE_CREDITED';
    offer.borrower.state = 'IN_DEBT';



    return getAssetRegistry('org.eprocess.peerloan.Account')
        .then(function(assetRegistry) {
            return assetRegistry.update(offer.lender);
        })
        .then(function() {
            return getAssetRegistry('org.eprocess.peerloan.Account');
        })
        .then(function(assetRegistry) {
            return assetRegistry.update(offer.borrower);
        })

}


/**
 * peerloan transaction
 * @param {org.eprocess.peerloan.LoanCheck} offer
 * @transaction
 */
async function LoanCheck(offer) {

    offer.lender.balance += offer.amount;
    offer.borrower.balance -= offer.amount;

    offer.lender.state = 'NEUTRAL';
    offer.borrower.state = 'NEUTRAL';

    return getAssetRegistry('org.eprocess.peerloan.Account')
        .then(function(assetRegistry) {
            return assetRegistry.update(offer.lender);
        })
        .then(function() {
            return getAssetRegistry('org.eprocess.peerloan.Account');
        })
        .then(function(assetRegistry) {
            return assetRegistry.update(offer.borrower);
        })

}