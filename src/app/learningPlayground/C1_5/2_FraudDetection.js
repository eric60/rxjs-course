
class FraudDetection {
  map

  constructor() {
      this.map = {}
  }

  parse() {
    console.log("test")
  }
}

transaction_values = [
    [1, "CREDIT", 100.00],
    [2, "CREDIT", 1000.00],
    [3, "CREDIT", 25.15],
    [100, "DEBIT", 15.21],
    [245, "DEBIT", 25.19],
    [246, "DEBIT", 250.19]
  ]


transaction_dates = [
    [1, "03122022"],
    [2, "04012022"],
    [3, "04012022"],
    [100, "04012022"],
    [245, "04212022"],
    [245, "04212022"]
  ]

fraudDetection = new FraudDetection()
fraudDetection.parse()
