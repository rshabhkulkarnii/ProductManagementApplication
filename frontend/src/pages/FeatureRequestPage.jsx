import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';
import FeatureRequestModal from '../components/FeatureRequestModal';

/**
 * Feature Request Page
 * Displays feature requests and allows voting
 */
function FeatureRequestPage() {
  const [featureRequests, setFeatureRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Load feature requests from localStorage (in a real app, this would be from API)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('featureRequests') || '[]');
    setFeatureRequests(saved);
  }, []);

  const handleSubmitRequest = async (requestData) => {
    const newRequest = {
      id: Date.now(),
      ...requestData,
      votes: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
      votedBy: []
    };

    const updated = [newRequest, ...featureRequests];
    setFeatureRequests(updated);
    localStorage.setItem('featureRequests', JSON.stringify(updated));
  };

  const handleVote = (requestId) => {
    const updated = featureRequests.map(req => {
      if (req.id === requestId) {
        // Simple voting - in real app, check user authentication
        const hasVoted = req.votedBy.includes('currentUser'); // Mock user
        if (!hasVoted) {
          return {
            ...req,
            votes: req.votes + 1,
            votedBy: [...req.votedBy, 'currentUser']
          };
        }
      }
      return req;
    });
    setFeatureRequests(updated);
    localStorage.setItem('featureRequests', JSON.stringify(updated));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'primary';
      case 'pending': return 'secondary';
      case 'rejected': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h1>💡 Feature Requests</h1>
          <p className="text-muted">Request new features and vote on existing ones</p>
        </Col>
        <Col className="text-end">
          <Button variant="success" onClick={() => setShowModal(true)}>
            ➕ Request Feature
          </Button>
        </Col>
      </Row>

      {featureRequests.length === 0 && (
        <Alert variant="info" className="text-center">
          <h5>No feature requests yet</h5>
          <p className="mb-0">Be the first to request a new feature!</p>
        </Alert>
      )}

      <Row>
        {featureRequests.map(request => (
          <Col md={6} lg={4} key={request.id} className="mb-4">
            <Card>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Card.Title className="h6">{request.title}</Card.Title>
                  <Badge bg={getPriorityColor(request.priority)}>
                    {request.priority}
                  </Badge>
                </div>

                <Card.Text className="text-muted small mb-3">
                  {request.description}
                </Card.Text>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Badge bg={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                  <span className="text-muted small">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">
                    👍 {request.votes} votes
                  </span>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleVote(request.id)}
                    disabled={request.votedBy.includes('currentUser')}
                  >
                    {request.votedBy.includes('currentUser') ? 'Voted' : 'Vote'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <FeatureRequestModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmitRequest}
      />
    </Container>
  );
}

export default FeatureRequestPage;