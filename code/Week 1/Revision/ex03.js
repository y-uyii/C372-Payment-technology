const payments = [
    { petName: 'Chester', amount: 50, status: 'APPROVED' },
    { petName: 'Mochi', amount: 80, status: 'PENDING' },
    { petName: 'Mira', amount: 40, status: 'DECLINED' },
];
console.log(payments[1].petName + '\'s payment status: ' + payments[1].status);

for (let i = 0; i < payments.length; i++) {
    const payment = payments[i].status;
    if (payment === 'APPROVED') {
        console.log('Pet-care service for ' + payments[i].petName + '\'s confirmed.');
    } else if (payment === 'PENDING') {
        console.log('Payment for ' + payments[i].petName + '\'s is being processed.');
    } else {
        console.log('Payment for ' + payments[i].petName + '\'s unsuccessful.');
    }
}
