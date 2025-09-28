# ML Model

The `/data` directory contains every .csv file needed:
- `features.csv` is the dataset on which this model is trained. `star_aggregator.py` was run on a much bigger dataset containing 2 million datapoints, which resulted to this one,
-  `test-data.csv` is for a user to enter custom input.

The `/model` directory contains the trained model.

## Steps for usage

1. Run `ml-model.py`,
2. Run `input-test.py` having entered the desired input in `test-data.py`,
3. Darbil.

`star_aggregator.py` does not need to be run for the model to function. In fact, running it will result in an error.