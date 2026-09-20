from backend.analytics.airfare_index import index_calculator

def test_calculate_basket_index():
    fares = [4500.0, 4800.0, 5200.0, 4300.0]
    result = index_calculator.calculate_basket_index(fares)
    assert "current_index" in result
    assert "avg_fare" in result
    assert result["sample_size"] == 4
    assert result["current_index"] > 0
