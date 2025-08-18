import random
import pytest

@pytest.fixture(autouse=True)
def seed_random():
    random.seed(10)