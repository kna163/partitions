Although the Littlewood decomposition is relatively well known in the theory of cores and quotients of integer partitions, explicit descriptions of the bijection seem to be quite rare, and algorithms for computing it even more so! This Python library allows one to work with this bijection as well as perform some other integer partitions computations such as iterating through all partitions, finding character values, and ordering partitions.

The Python library is entirely self contained in [/src/partitions/parti.py](https://github.com/kna163/partitions/blob/main/src/partitions/parti.py). Meanwhile, the JS port (containing a few less functions) is located at [/src/js/parti.js](https://github.com/kna163/partitions/blob/main/src/js/parti.js) and the interpreter for the basic language on the website is at [/src/js/parse.js](https://github.com/kna163/partitions/blob/main/src/js/parse.js). For many reasons, it is highly recommended to check out the [website](https://kna163.github.io/partitions/).

## Key Features
### Python Library
Capable of performing the Littlewood decomposition (both ways) and several related 01-sequence computations. Some other functions of interest include `next_part()` and `gen_parts_n()` allowing lexicographic iteration through partitions, `get_pnk(n,k)` which is the number of partitions of n with parts of size at most k, and finally `get_char_value()` which returns the irreducible character evaluated on a conjugacy class, both represented by their respective partitions.
### Website
Contains slides motivating, describing and proving the Littlewood decomposition. Also contains some notes for an easier-to-read but perhaps not-as-fun experience.
Has documentation for the Python library and an online parser, interpretor and evaluator for a JS port of the decomposition functions.
