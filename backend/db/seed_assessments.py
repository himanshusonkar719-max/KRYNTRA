from db.database import SessionLocal
from db.models import Assessment, Question

ASSESSMENTS_SEED = [
    {
        "id": "assess-web-001",
        "title": "Web Application Security Fundamentals",
        "description": "Learn the core principles of web application security. Covers the OWASP Top 10, cross-site scripting (XSS), SQL injection, and secure session management.",
        "domain": "Web Application Security",
        "domain_slug": "web-app-security",
        "difficulty": "beginner",
        "duration_mins": 15,
        "total_points": 30,
        "questions": [
            {
                "id": "q-web-1",
                "type": "mcq",
                "text": "What does OWASP stand for?",
                "options": [
                    {"id": "a", "text": "Open Web Application Security Project"},
                    {"id": "b", "text": "Online Web Asset Security Protocol"},
                    {"id": "c", "text": "Optimal Web Access Security Program"},
                    {"id": "d", "text": "Open Wireless Access Security Partnership"}
                ],
                "correct_answer": "a",
                "explanation": "OWASP stands for Open Web Application Security Project, a global non-profit organization dedicated to improving software security.",
                "points": 10
            },
            {
                "id": "q-web-2",
                "type": "mcq",
                "text": "Which HTTP response header is primarily used to mitigate and prevent Clickjacking attacks?",
                "options": [
                    {"id": "a", "text": "Content-Security-Policy"},
                    {"id": "b", "text": "X-Frame-Options"},
                    {"id": "c", "text": "Strict-Transport-Security"},
                    {"id": "d", "text": "X-Content-Type-Options"}
                ],
                "correct_answer": "b",
                "explanation": "The X-Frame-Options HTTP response header indicates whether a browser should be allowed to render a page in a <frame>, <iframe>, <embed> or <object>.",
                "points": 10
            },
            {
                "id": "q-web-3",
                "type": "mcq",
                "text": "What is the primary and most effective defense against SQL Injection (SQLi) vulnerabilities?",
                "options": [
                    {"id": "a", "text": "Web Application Firewalls (WAF)"},
                    {"id": "b", "text": "Client-side input validation"},
                    {"id": "c", "text": "Prepared statements (parameterized queries)"},
                    {"id": "d", "text": "Encrypting the database traffic"}
                ],
                "correct_answer": "c",
                "explanation": "Prepared statements (parameterized queries) ensure that the database treats user input strictly as parameters, preventing SQL syntax manipulation.",
                "points": 10
            }
        ]
    },
    {
        "id": "assess-net-002",
        "title": "Network Perimeter Security & Defense",
        "description": "Test your knowledge on firewalls, intrusion detection/prevention systems (IDS/IPS), network segmentation, secure protocols, and port scanning techniques.",
        "domain": "Network Security",
        "domain_slug": "network-security",
        "difficulty": "intermediate",
        "duration_mins": 30,
        "total_points": 30,
        "questions": [
            {
                "id": "q-net-1",
                "type": "mcq",
                "text": "Which port is used by default for secure shell (SSH) remote administration traffic?",
                "options": [
                    {"id": "a", "text": "Port 21"},
                    {"id": "b", "text": "Port 22"},
                    {"id": "c", "text": "Port 23"},
                    {"id": "d", "text": "Port 443"}
                ],
                "correct_answer": "b",
                "explanation": "Port 22 is reserved for SSH by default. Port 21 is FTP, Port 23 is Telnet, and Port 443 is HTTPS.",
                "points": 10
            },
            {
                "id": "q-net-2",
                "type": "mcq",
                "text": "What is the key operational difference between an Intrusion Detection System (IDS) and an Intrusion Prevention System (IPS)?",
                "options": [
                    {"id": "a", "text": "IDS only monitors traffic, whereas IPS can actively block malicious traffic inline"},
                    {"id": "b", "text": "IPS only monitors internal traffic, while IDS monitors external traffic"},
                    {"id": "c", "text": "IDS is a software tool, whereas IPS is strictly a hardware appliance"},
                    {"id": "d", "text": "There is no difference; they are synonymous terms"}
                ],
                "correct_answer": "a",
                "explanation": "An IDS is passive; it detects and alerts on suspicious traffic. An IPS sits inline and can drop or block malicious packets directly.",
                "points": 10
            },
            {
                "id": "q-net-3",
                "type": "mcq",
                "text": "Which protocol translates domain names to IP addresses, and is frequently targeted by cache poisoning attacks?",
                "options": [
                    {"id": "a", "text": "DHCP"},
                    {"id": "b", "text": "ARP"},
                    {"id": "c", "text": "DNS"},
                    {"id": "d", "text": "BGP"}
                ],
                "correct_answer": "c",
                "explanation": "DNS (Domain Name System) translates hostnames to IP addresses. Cache poisoning poisons resolver entries to redirect users to malicious servers.",
                "points": 10
            }
        ]
    },
    {
        "id": "assess-ir-003",
        "title": "Incident Response Triage & Lifecycle",
        "description": "Demonstrate competency in handling incident lifecycles, identifying containment strategies, performing log analysis, and conducting forensic evidence preservation.",
        "domain": "Incident Response",
        "domain_slug": "incident-response",
        "difficulty": "advanced",
        "duration_mins": 45,
        "total_points": 30,
        "questions": [
            {
                "id": "q-ir-1",
                "type": "mcq",
                "text": "According to the NIST Incident Handling Guide (SP 800-61), what is the first phase of the Incident Response lifecycle?",
                "options": [
                    {"id": "a", "text": "Detection & Analysis"},
                    {"id": "b", "text": "Preparation"},
                    {"id": "c", "text": "Containment, Eradication & Recovery"},
                    {"id": "d", "text": "Post-Incident Activity"}
                ],
                "correct_answer": "b",
                "explanation": "Preparation is the foundation of incident response, ensuring tools, policies, communication channels, and playbooks are established in advance.",
                "points": 10
            },
            {
                "id": "q-ir-2",
                "type": "mcq",
                "text": "When a critical web server is identified as compromised by active malware, what is generally the best immediate containment step?",
                "options": [
                    {"id": "a", "text": "Format the server immediately to wipe all malware traces"},
                    {"id": "b", "text": "Isolate the server from the network while preserving volatile RAM memory state"},
                    {"id": "c", "text": "Power down the server immediately by pulling the power cord"},
                    {"id": "d", "text": "Leave it fully connected to monitor the attacker in real-time"}
                ],
                "correct_answer": "b",
                "explanation": "Network isolation stops lateral movement and command-and-control communication, while preserving volatile memory allows memory dump forensic extraction.",
                "points": 10
            },
            {
                "id": "q-ir-3",
                "type": "mcq",
                "text": "On a Linux server, which command is most useful for identifying open ports and the active processes listening on them?",
                "options": [
                    {"id": "a", "text": "ping -c 4"},
                    {"id": "b", "text": "traceroute"},
                    {"id": "c", "text": "ss -tulpn"},
                    {"id": "d", "text": "ifconfig"}
                ],
                "correct_answer": "c",
                "explanation": "The `ss -tulpn` command displays listening TCP and UDP sockets with numerical port numbers and process IDs/names.",
                "points": 10
            }
        ]
    },
    {
        "id": "assess-web-004",
        "title": "Advanced Web Application Vulnerability Analysis",
        "description": "Deconstruct complex multi-stage web application vulnerabilities. Contains scenario-based intrusion analysis and code auditing questions.",
        "domain": "Web Application Security",
        "domain_slug": "web-app-security",
        "difficulty": "advanced",
        "duration_mins": 45,
        "total_points": 30,
        "questions": [
            {
                "id": "q-adv-web-1",
                "type": "mcq",
                "text": "Which vulnerability occurs when a server-side application processes XML input containing external entity references without restricting resolve access?",
                "options": [
                    {"id": "a", "text": "Server-Side Request Forgery (SSRF)"},
                    {"id": "b", "text": "XML External Entity Injection (XXE)"},
                    {"id": "c", "text": "Insecure Deserialization"},
                    {"id": "d", "text": "XML XPath Injection"}
                ],
                "correct_answer": "b",
                "explanation": "XML External Entity (XXE) injection occurs when an XML parser processes external entity references, allowing file reading, SSRF, or denial of service.",
                "points": 10
            },
            {
                "id": "q-adv-web-2",
                "type": "scenario",
                "scenario_text": "LOG AUDIT EVENT:\nIP: 198.51.100.42\nREQUEST: GET /api/v1/users/profile?id=99%20UNION%20SELECT%20null,null,password_hash%20FROM%20users%20--\nHTTP STATUS: 200 (4850 bytes)",
                "text": "Based on the log audit output above, which type of attack is being actively executed?",
                "options": [
                    {"id": "a", "text": "Cross-Site Scripting (XSS)"},
                    {"id": "b", "text": "Path Traversal"},
                    {"id": "c", "text": "Union-Based SQL Injection"},
                    {"id": "d", "text": "Remote Code Execution"}
                ],
                "correct_answer": "c",
                "explanation": "The request contains `%20UNION%20SELECT%20...` which is a classic Union-Based SQL Injection pattern designed to extract credentials from target database tables.",
                "points": 10
            },
            {
                "id": "q-adv-web-3",
                "type": "code_review",
                "code_block": "const { exec } = require('child_process');\napp.get('/api/lookup', (req, res) => {\n  const targetDomain = req.query.domain;\n  exec(`nslookup ${targetDomain}`, (error, stdout) => {\n    res.json({ output: stdout });\n  });\n});",
                "text": "Identify the primary security vulnerability in the code block above.",
                "options": [
                    {"id": "a", "text": "Command Injection via unvalidated shell input execution"},
                    {"id": "b", "text": "Buffer Overflow in child_process"},
                    {"id": "c", "text": "Denial of Service due to recursive DNS"},
                    {"id": "d", "text": "Cross-Origin Resource Sharing (CORS) flaw"}
                ],
                "correct_answer": "a",
                "explanation": "Passing untrusted user input directly to `exec()` allows an attacker to append shell metacharacters (such as `; rm -rf /` or `| cat /etc/passwd`) to execute arbitrary system commands.",
                "points": 10
            }
        ]
    },
    {
        "id": "assess-cloud-005",
        "title": "Cloud Infrastructure & IAM Security",
        "description": "Assess cloud workload isolation, IAM least privilege principles, S3 bucket policy misconfigurations, and cloud audit logging.",
        "domain": "Cloud Security",
        "domain_slug": "cloud-security",
        "difficulty": "intermediate",
        "duration_mins": 30,
        "total_points": 30,
        "questions": [
            {
                "id": "q-cloud-1",
                "type": "mcq",
                "text": "What does the Principle of Least Privilege (PoLP) dictate in cloud identity and access management?",
                "options": [
                    {"id": "a", "text": "Users should receive full Administrator permissions for development velocity"},
                    {"id": "b", "text": "Identities should only be granted the minimum permissions strictly necessary to perform their assigned function"},
                    {"id": "c", "text": "All IAM roles should expire after 60 seconds"},
                    {"id": "d", "text": "Root credentials should be shared among the senior engineering team"}
                ],
                "correct_answer": "b",
                "explanation": "The Principle of Least Privilege ensures that every user, service, or process possesses only the bare minimum permissions necessary to complete tasks.",
                "points": 10
            },
            {
                "id": "q-cloud-2",
                "type": "mcq",
                "text": "Which AWS service records API calls and account activity for governance and compliance auditing?",
                "options": [
                    {"id": "a", "text": "Amazon CloudWatch"},
                    {"id": "b", "text": "AWS CloudTrail"},
                    {"id": "c", "text": "Amazon GuardDuty"},
                    {"id": "d", "text": "AWS Shield"}
                ],
                "correct_answer": "b",
                "explanation": "AWS CloudTrail records events, API calls, and user actions performed in the AWS Management Console, SDKs, and CLI.",
                "points": 10
            },
            {
                "id": "q-cloud-3",
                "type": "mcq",
                "text": "An attacker compromises an SSRF vulnerability on an EC2 instance. What endpoint are they most likely attempting to query to steal IAM role credentials?",
                "options": [
                    {"id": "a", "text": "http://169.254.169.254/latest/meta-data/iam/security-credentials/"},
                    {"id": "b", "text": "http://localhost:8080/admin/credentials.json"},
                    {"id": "c", "text": "https://aws.amazon.com/iam/tokens/"},
                    {"id": "d", "text": "http://127.0.0.1:9000/api/keys"}
                ],
                "correct_answer": "a",
                "explanation": "169.254.169.254 is the Instance Metadata Service (IMDS) link-local address, which exposes temporary IAM role credentials if IMDSv2 is not strictly enforced.",
                "points": 10
            }
        ]
    },
    {
        "id": "assess-grc-006",
        "title": "Governance, Risk & Compliance Essentials",
        "description": "Understand core cybersecurity compliance frameworks (SOC2, ISO 27001, NIST CSF), risk assessment methodologies, and data privacy regulations (GDPR).",
        "domain": "Governance & Compliance",
        "domain_slug": "governance-compliance",
        "difficulty": "beginner",
        "duration_mins": 25,
        "total_points": 30,
        "questions": [
            {
                "id": "q-grc-1",
                "type": "mcq",
                "text": "Under the EU General Data Protection Regulation (GDPR), within what timeframe must a supervisory authority be notified of a data breach?",
                "options": [
                    {"id": "a", "text": "Within 24 hours"},
                    {"id": "b", "text": "Within 72 hours of becoming aware of the breach"},
                    {"id": "c", "text": "Within 30 calendar days"},
                    {"id": "d", "text": "Only upon quarterly audit reviews"}
                ],
                "correct_answer": "b",
                "explanation": "Article 33 of GDPR mandates that controllers notify the competent supervisory authority without undue delay and, where feasible, not later than 72 hours after becoming aware.",
                "points": 10
            },
            {
                "id": "q-grc-2",
                "type": "mcq",
                "text": "Which SOC 2 Trust Services Criteria category is mandatory for all SOC 2 compliance examinations?",
                "options": [
                    {"id": "a", "text": "Privacy"},
                    {"id": "b", "text": "Security (Common Criteria)"},
                    {"id": "c", "text": "Confidentiality"},
                    {"id": "d", "text": "Processing Integrity"}
                ],
                "correct_answer": "b",
                "explanation": "The Security criteria (often called the Common Criteria) is the only baseline mandatory category for every SOC 2 audit report.",
                "points": 10
            },
            {
                "id": "q-grc-3",
                "type": "mcq",
                "text": "What are the core functions of the NIST Cybersecurity Framework (CSF)?",
                "options": [
                    {"id": "a", "text": "Plan, Code, Build, Test, Release, Deploy"},
                    {"id": "b", "text": "Identify, Protect, Detect, Respond, Recover (and Govern in CSF 2.0)"},
                    {"id": "c", "text": "Confidentiality, Integrity, Availability"},
                    {"id": "d", "text": "Discovery, Weaponization, Delivery, Exploitation"}
                ],
                "correct_answer": "b",
                "explanation": "The NIST CSF core functions are Identify, Protect, Detect, Respond, Recover, with CSF 2.0 adding Govern as an overarching sixth pillar.",
                "points": 10
            }
        ]
    }
]


def seed_assessments():
    from db.database import engine, Base
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        for a_data in ASSESSMENTS_SEED:
            existing = db.query(Assessment).filter(Assessment.id == a_data["id"]).first()
            if not existing:
                assessment = Assessment(
                    id=a_data["id"],
                    title=a_data["title"],
                    description=a_data["description"],
                    domain=a_data["domain"],
                    domain_slug=a_data["domain_slug"],
                    difficulty=a_data["difficulty"],
                    duration_mins=a_data["duration_mins"],
                    total_points=a_data["total_points"],
                    is_premium=0
                )
                db.add(assessment)
                db.flush()

                for q_data in a_data["questions"]:
                    question = Question(
                        id=q_data["id"],
                        assessment_id=assessment.id,
                        text=q_data["text"],
                        type=q_data.get("type", "mcq"),
                        scenario_text=q_data.get("scenario_text"),
                        code_block=q_data.get("code_block"),
                        options=q_data["options"],
                        correct_answer=q_data["correct_answer"],
                        points=q_data.get("points", 10),
                        explanation=q_data.get("explanation")
                    )
                    db.add(question)
        db.commit()
        print("Successfully seeded all assessments and questions into SQLite database!")
    finally:
        db.close()


if __name__ == "__main__":
    seed_assessments()
