import React from "react";
import { Container, Row, Col, Card, Button, Image } from "react-bootstrap";
import { FaFacebook, FaGithub, FaYoutube, FaBook } from "react-icons/fa";

const ProfilePage = () => {
  return (
    <Container className="mt-5 mb-4">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="text-center">
            <Card.Body>
              <Image
                src="/assets/profile.jpg"
                roundedCircle
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "cover",
                  marginBottom: "15px",
                }}
                alt="Profile Picture"
              />
              <Card.Title>Lo Van Duong</Card.Title>
              <Card.Text>
                Posts and Telecommunications Institute of Technology
              </Card.Text>
              <Card.Text>Ha Noi</Card.Text>
              <Card.Text>D21CN07 - B21DCCN283</Card.Text>
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Body>
              <Card.Title>About This Project</Card.Title>
              <Card.Text>
                Build an IoT system to monitor and control environmental parameters such as temperature, humidity, and light. 
                The system also allows for controlling devices such as fans, air conditioners, 
                and lights through a user-friendly interface.
              </Card.Text>
              <hr />
              <Row>
                <Col md={6}>
                  <h5 className="mb-3">Contact Information</h5>
                  <p className="mb-4">
                    <strong>Email:</strong> duodaiz1412@gmail.com
                  </p>
                  <p className="mb-4">
                    <strong>Phone:</strong> +0964 000 337
                  </p>
                  <p className="mb-4">
                    <strong>Location:</strong> Ha Noi, Viet Nam
                  </p>
                </Col>
                <Col md={6}>
                  <h5>Social Media & Resources:</h5>
                  <div className="d-block mb-2">
                    <Button
                      variant="primary"
                      className="w-100 mb-2"
                      href="https://www.facebook.com/profile.php?id=100013005340529"
                      target="_blank"
                    >
                      <FaFacebook className="me-2" /> Facebook
                    </Button>
                  </div>

                  <div className="d-block mb-2">
                    <Button
                      variant="dark"
                      className="w-100 mb-2"
                      href="https://github.com/Dazkiz1412"
                      target="_blank"
                    >
                      <FaGithub className="me-2 " /> GitHub
                    </Button>
                  </div>

                  <div className="d-block mb-2">
                    <Button
                      variant="danger"
                      className="w-100 mb-2"
                      href="https://www.youtube.com/@Teof4992"
                      target="_blank"
                    >
                      <FaYoutube className="me-2" /> YouTube
                    </Button>
                  </div>

                  <div className="d-block mb-2">
                    <Button
                      variant="success"
                      className="w-100 mb-2"
                      href="http://localhost:8081/api-docs"
                      target="_blank"
                    >
                      <FaBook className="me-2" /> API Docs
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;