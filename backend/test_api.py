from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_sa_diabetes_articles_endpoint_returns_articles():
    response = client.get('/api/sa-diabetes-articles')

    assert response.status_code == 200
    payload = response.json()
    assert 'articles' in payload
    assert 'source_type' in payload
    assert isinstance(payload['articles'], list)
    assert len(payload['articles']) >= 1

    article = payload['articles'][0]
    assert 'title' in article
    assert 'source' in article
    assert 'url' in article


def test_sa_diabetes_cases_endpoint_returns_statistics():
    response = client.get('/api/sa-diabetes-cases')

    assert response.status_code == 200
    payload = response.json()
    assert 'country' in payload
    assert payload['country'] == 'South Africa'
    assert 'statistics' in payload
    assert 'provincial_breakdown' in payload
    assert 'key_findings' in payload
    assert isinstance(payload['key_findings'], list)
    assert len(payload['key_findings']) >= 1
    
    stats = payload['statistics']
    assert 'national_prevalence' in stats
    assert 'estimated_cases' in stats
    assert 'undiagnosed_cases' in stats
