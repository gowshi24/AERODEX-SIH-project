def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"

def test_search_flights(client):
    response = client.get("/api/flights/search?fromCode=DEL&toCode=BOM")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_get_live_market_snapshot(client):
    response = client.get("/api/index/snapshot")
    assert response.status_code == 200
    data = response.json()
    assert "currentIndex" in data

def test_get_anomalies(client):
    response = client.get("/api/anomalies")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_get_cpi_insights(client):
    response = client.get("/api/cpi/insights")
    assert response.status_code == 200
    data = response.json()
    assert "airfareChange" in data

def test_get_backtest_results(client):
    response = client.get("/api/backtesting")
    assert response.status_code == 200
    data = response.json()
    assert "mape" in data
