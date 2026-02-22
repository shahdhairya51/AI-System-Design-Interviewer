/**
 * LLD Curriculum — 16 chapters across 5 units
 * Content extracted from Complete LLD Interview Guide
 */

export const LLD_UNITS = [
    { id: 1, name: 'OOP Foundations', icon: 'foundations', difficulty: 'Beginner' },
    { id: 2, name: 'Design Patterns', icon: 'architecture', difficulty: 'Intermediate' },
    { id: 3, name: 'Advanced Concepts', icon: 'code', difficulty: 'Intermediate' },
    { id: 4, name: 'Complete Walkthroughs', icon: 'architecture', difficulty: 'Advanced' },
    { id: 5, name: 'Interview Mastery', icon: 'mastery', difficulty: 'Expert' },
]

export const LLD_CHAPTERS = [
    // ═══════════════════════════════════════════════════════
    //  UNIT 1: OOP FOUNDATIONS
    // ═══════════════════════════════════════════════════════
    {
        id: 'four-pillars-oop',
        title: 'The Four Pillars of OOP',
        unit: 1,
        duration: '18 min',
        icon: 'foundations',
        sections: [
            { type: 'text', title: 'The Foundation of All Design', content: 'Every LLD interview tests your mastery of Object-Oriented Programming. These four pillars aren\'t just theory — they\'re the tools you use to write clean, maintainable, extensible code.\n\nMaster these, and every design pattern becomes intuitive.' },
            {
                type: 'concept-card', title: 'The Four Pillars', items: [
                    { term: 'Abstraction', definition: 'Hide complexity, expose only what\'s necessary. Like driving a car — you see the steering wheel, not the engine internals.' },
                    { term: 'Encapsulation', definition: 'Bundle data + methods together. Control access with private/public. Protect internal state from corruption.' },
                    { term: 'Inheritance', definition: 'Create new classes based on existing ones. Reuse code. But prefer composition over deep inheritance hierarchies.' },
                    { term: 'Polymorphism', definition: 'Same interface, different behavior. A Shape\'s draw() works differently for Circle vs Rectangle, but the caller doesn\'t care.' },
                ]
            },
            { type: 'code', language: 'python', title: 'Abstraction — Bad vs Good', content: '# ❌ Bad: Client knows SMTP details\nclass EmailSender:\n    def send_email(self, to, subject, body):\n        import smtplib\n        server = smtplib.SMTP(\'smtp.gmail.com\', 587)\n        server.starttls()\n        server.login(\'user@gmail.com\', \'password\')\n        server.sendmail(\'user@gmail.com\', to, f"Subject: {subject}\\n\\n{body}")\n\n# ✅ Good: Abstract interface hides implementation\nfrom abc import ABC, abstractmethod\n\nclass NotificationService(ABC):\n    @abstractmethod\n    def send(self, recipient: str, message: str) -> bool:\n        pass\n\nclass EmailNotification(NotificationService):\n    def __init__(self, smtp_config):\n        self._config = smtp_config  # Details hidden\n    \n    def send(self, recipient: str, message: str) -> bool:\n        # SMTP complexity hidden from the caller\n        return self._send_via_smtp(recipient, message)\n\nclass SMSNotification(NotificationService):\n    def send(self, recipient: str, message: str) -> bool:\n        return self._send_via_twilio(recipient, message)\n\n# Client code — clean and simple\ndef notify_user(service: NotificationService, user: str, msg: str):\n    service.send(user, msg)  # Works with Email, SMS, Push, etc.' },
            { type: 'code', language: 'java', title: 'Abstraction — Java', content: 'interface NotificationService {\n    boolean send(String recipient, String message);\n}\n\nclass EmailNotification implements NotificationService {\n    private SmtpConfig config;\n    \n    public EmailNotification(SmtpConfig config) {\n        this.config = config;\n    }\n    \n    public boolean send(String recipient, String message) {\n        // Hides SMTP complexity\n        return smtpSend(recipient, message);\n    }\n}\n\n// Client code\nvoid notifyUser(NotificationService service, String user, String msg) {\n    service.send(user, msg);\n}' },
            { type: 'code', language: 'python', title: 'Encapsulation — Protecting State', content: 'class BankAccount:\n    def __init__(self, owner: str, initial_balance: float = 0):\n        self._owner = owner\n        self.__balance = initial_balance  # Private — can\'t be set directly\n        self.__transactions = []\n    \n    @property\n    def balance(self) -> float:\n        return self.__balance  # Read-only access\n    \n    def deposit(self, amount: float):\n        if amount <= 0:\n            raise ValueError("Deposit must be positive")\n        self.__balance += amount\n        self.__transactions.append(("deposit", amount))\n    \n    def withdraw(self, amount: float):\n        if amount > self.__balance:\n            raise ValueError("Insufficient funds")\n        self.__balance -= amount\n        self.__transactions.append(("withdraw", amount))\n\n# Usage: Can\'t accidentally set balance to negative\naccount = BankAccount("Alice", 1000)\naccount.deposit(500)    # ✅ Controlled access\n# account.__balance = -1  # ❌ Can\'t bypass validation' },
            { type: 'code', language: 'java', title: 'Encapsulation — Java', content: 'class BankAccount {\n    private String owner;\n    private double balance;\n\n    public BankAccount(String owner, double initialBalance) {\n        this.owner = owner;\n        this.balance = initialBalance;\n    }\n\n    public double getBalance() {\n        return balance;\n    }\n\n    public void deposit(double amount) {\n        if (amount <= 0) throw new IllegalArgumentException("Invalid amount");\n        this.balance += amount;\n    }\n\n    public void withdraw(double amount) {\n        if (amount > balance) throw new IllegalArgumentException("Insufficient funds");\n        this.balance -= amount;\n    }\n}' },
            {
                type: 'deep-dive',
                title: 'Polymorphism: The "Plug & Play" Concept',
                content: `Polymorphism allows you to treat different objects as if they were the same type.

**Real-world analogy:**
Think of a standard **power outlet**.
*   You can plug in a TV, a Laptop, or a Blender.
*   The outlet doesn't know what's plugged in. It just provides power.
*   The devices (TV, Laptop, Blender) are "polymorphic" — they all implement the "Pluggable" interface but behave differently.

**In Code:**
You write code that works with \`PaymentMethod\`.
*   At runtime, you pass in \`CreditCard\`, \`PayPal\`, or \`Bitcoin\`.
*   The function calls \`.pay()\`, and the specific object handles the logic. This makes your system extensible without modifying existing code.`
            },

            {
                type: 'quiz',
                question: 'Which principle allows you to swap a "MySQLDatabase" class with a "PostgreSQLDatabase" class without breaking the app?',
                options: ['Encapsulation', 'Polymorphism', 'Inheritance', 'Singleton'],
                correctIndex: 1,
                explanation: 'Polymorphism allows different classes to share a common interface (e.g., Database), so they can be incorrectchangeable.'
            },
            {
                type: 'quiz',
                question: 'Why is Composition often preferred over Inheritance?',
                options: ['Inheritance is slower performance-wise', 'Composition is more flexible and avoids "fragile base class" issues', 'Inheritance does not support polymorphism', 'Composition requires less code'],
                correctIndex: 1,
                explanation: 'Inheritance creates a tight coupling between parent and child. Composition allows behavior to be swapped at runtime (Strategy Pattern) and avoids deep hierarchies that are hard to refactor.'
            },
            { type: 'tip', variant: 'interview', content: 'In interviews, always default to making fields PRIVATE. Only expose what\'s necessary through methods or properties. If an interviewer asks "Can I access this field directly?" — say no, and explain why encapsulation protects data integrity.' },
        ],
    },
    {
        id: 'solid-principles',
        title: 'SOLID Principles',
        unit: 1,
        duration: '20 min',
        icon: 'foundations',
        sections: [
            { type: 'text', title: 'The Five Rules of Clean Design', content: 'SOLID is the most important set of principles in software design. Interviewers at FAANG companies evaluate your code against these principles, often without explicitly mentioning them.\n\nViolating SOLID creates code that\'s hard to change, test, and extend — exactly what interviewers watch for.' },
            {
                type: 'concept-card', title: 'SOLID at a Glance', items: [
                    { term: 'S — Single Responsibility', definition: 'A class should have only ONE reason to change. If UserManager handles auth AND email AND logging, it violates SRP.' },
                    { term: 'O — Open/Closed', definition: 'Open for extension, closed for modification. Add new behaviors without changing existing code. Use interfaces and polymorphism.' },
                    { term: 'L — Liskov Substitution', definition: 'Subtypes must be substitutable for their base types. If Square extends Rectangle but breaks setWidth(), it violates LSP.' },
                    { term: 'I — Interface Segregation', definition: 'Don\'t force classes to implement interfaces they don\'t use. Split fat interfaces into focused ones.' },
                    { term: 'D — Dependency Inversion', definition: 'Depend on abstractions, not concrete classes. High-level modules shouldn\'t depend on low-level details.' },
                ]
            },
            { type: 'code', language: 'python', title: 'SRP — Before and After', content: '# ❌ Violates SRP: One class doing 3 things\nclass UserManager:\n    def create_user(self, data): ...    # User CRUD\n    def send_welcome_email(self, user): ...  # Email sending\n    def log_user_activity(self, user): ...  # Logging\n\n# ✅ Follows SRP: Each class has one responsibility\nclass UserRepository:\n    def create(self, data): ...\n    def find_by_id(self, id): ...\n\nclass EmailService:\n    def send_welcome(self, user): ...\n    def send_password_reset(self, user): ...\n\nclass ActivityLogger:\n    def log(self, user, action): ...\n\nclass UserRegistrationService:  # Orchestrator\n    def __init__(self, repo, email, logger):\n        self._repo = repo\n        self._email = email\n        self._logger = logger\n    \n    def register(self, data):\n        user = self._repo.create(data)\n        self._email.send_welcome(user)\n        self._logger.log(user, "registered")\n        return user' },
            { type: 'code', language: 'java', title: 'SRP — Java', content: 'class UserRepository {\n    public void save(User user) { ... }\n}\n\nclass EmailService {\n    public void sendWelcomeEmail(User user) { ... }\n}\n\nclass UserService {\n    private UserRepository repo;\n    private EmailService emailService;\n\n    public UserService(UserRepository repo, EmailService emailService) {\n        this.repo = repo;\n        this.emailService = emailService;\n    }\n\n    public void register(User user) {\n        repo.save(user);\n        emailService.sendWelcomeEmail(user);\n    }\n}' },
            { type: 'code', language: 'python', title: 'Open/Closed — Adding Features Without Changing Code', content: '# ❌ Violates OCP: Must modify class to add new payment types\nclass PaymentProcessor:\n    def process(self, payment_type, amount):\n        if payment_type == "credit_card":\n            # process credit card\n        elif payment_type == "paypal":\n            # process paypal\n        elif payment_type == "bitcoin":  # Must modify this class!\n            # process bitcoin\n\n# ✅ Follows OCP: Add new payments WITHOUT touching existing code\nclass PaymentStrategy(ABC):\n    @abstractmethod\n    def process(self, amount: float) -> bool: ...\n\nclass CreditCardPayment(PaymentStrategy):\n    def process(self, amount): ...\n\nclass PayPalPayment(PaymentStrategy):\n    def process(self, amount): ...\n\nclass BitcoinPayment(PaymentStrategy):  # Just add a new class!\n    def process(self, amount): ...\n\nclass PaymentProcessor:\n    def process(self, strategy: PaymentStrategy, amount: float):\n        return strategy.process(amount)  # Works with ANY payment type' },
            { type: 'code', language: 'java', title: 'Open/Closed — Java', content: 'interface PaymentStrategy {\n    void pay(double amount);\n}\n\nclass CreditCard implements PaymentStrategy {\n    public void pay(double amount) { System.out.println("Paid " + amount + " via Card"); }\n}\n\nclass PayPal implements PaymentStrategy {\n    public void pay(double amount) { System.out.println("Paid " + amount + " via PayPal"); }\n}\n\nclass PaymentProcessor {\n    public void process(PaymentStrategy strategy, double amount) {\n        strategy.pay(amount);\n    }\n}' },
            {
                type: 'quiz',
                question: 'Which SOLID principle warns against making a "Square" class inherit from a "Rectangle" class if it alters expected behavior (like setWidth influencing Height)?',
                options: ['Single Responsibility', 'Open/Closed', 'Liskov Substitution', 'Interface Segregation'],
                correctIndex: 2,
                explanation: 'Liskov Substitution Principle (LSP) states that subclasses should be substitutable for their base classes without altering correctness. A Square changing both dimensions when one is set violates the expectation of a Rectangle.'
            },
            { type: 'tip', variant: 'interview', content: 'When designing classes in an LLD interview, mentally check each SOLID principle. If you catch yourself adding an if/elif chain, that\'s a sign you need the Strategy or Factory pattern. Call it out: "I see this could violate OCP, so let me use a Strategy pattern instead."' },
        ],
    },
    {
        id: 'solid-in-practice',
        title: 'SOLID in Practice',
        unit: 1,
        duration: '25 min',
        icon: 'code',
        sections: [
            { type: 'text', title: 'Refactoring to SOLID', content: 'Theory is easy. Practice is hard. Let\'s take a "bad" piece of code and refactor it step-by-step to adhere to SOLID principles. This is exactly what you might be asked to do in a "Refactoring" interview.' },
            { type: 'code', language: 'python', title: '❌ The Bad Code (God Class)', content: 'class OrderManager:\n    def process_order(self, order_id, items, payment_type):\n        # 1. Calculate Total\n        total = 0\n        for item in items:\n            total += item.price\n            \n        # 2. Process Payment\n        if payment_type == "credit":\n            print(f"Charging credit card: {total}")\n        elif payment_type == "paypal":\n            print(f"Charging PayPal: {total}")\n            \n        # 3. Save to DB\n        import sqlite3\n        conn = sqlite3.connect("db.sqlite")\n        conn.execute(f"INSERT INTO orders VALUES ({order_id}, {total})")\n        \n        # 4. Send Email\n        print(f"Sending receipt for order {order_id}")' },
            { type: 'code', language: 'java', title: '❌ The Bad Code (God Class) — Java', content: 'class OrderManager {\n    public void processOrder(int orderId, List<Item> items, String paymentType) {\n        // 1. Calculate Total\n        double total = 0;\n        for (Item item : items) total += item.price;\n\n        // 2. Process Payment\n        if (paymentType.equals("credit")) {\n            System.out.println("Charging credit card: " + total);\n        } else if (paymentType.equals("paypal")) {\n            System.out.println("Charging PayPal: " + total);\n        }\n\n        // 3. Save to DB\n        Database.save(orderId, total);\n\n        // 4. Send Email\n        System.out.println("Sending receipt for order " + orderId);\n    }\n}' },
            { type: 'text', title: 'Step 1: Single Responsibility (SRP)', content: 'The `OrderManager` does too much: calculation, payment, database, and email. Let\'s split it.\n\n- `OrderCalculator`\n- `PaymentProcessor`\n- `OrderRepository`\n- `EmailService`' },
            { type: 'code', language: 'python', title: '✅ Step 2: Open/Closed (OCP)', content: 'from abc import ABC, abstractmethod\n\n# Abstract Payment Strategy\nclass PaymentStrategy(ABC):\n    @abstractmethod\n    def pay(self, amount): ...\n\nclass CreditCard(PaymentStrategy):\n    def pay(self, amount): print(f"Charging Card: {amount}")\n\nclass PayPal(PaymentStrategy):\n    def pay(self, amount): print(f"Charging PayPal: {amount}")\n\n# Now we can add Bitcoin without changing OrderManager!' },
            { type: 'code', language: 'java', title: '✅ Step 2: Open/Closed — Java', content: 'interface PaymentStrategy {\n    void pay(double amount);\n}\n\nclass CreditCard implements PaymentStrategy {\n    public void pay(double amount) { System.out.println("Charging Card: " + amount); }\n}\n\nclass PayPal implements PaymentStrategy {\n    public void pay(double amount) { System.out.println("Charging PayPal: " + amount); }\n}\n\n// Now we can add Bitcoin without changing OrderManager!' },
            { type: 'code', language: 'python', title: '✅ Step 3: Dependency Inversion (DIP)', content: '# Depend on abstractions, not concrete classes\nclass OrderService:\n    def __init__(self, \n                 calculator: OrderCalculator,\n                 payment: PaymentStrategy,\n                 repo: OrderRepository,\n                 notifier: NotificationService):\n        self.calculator = calculator\n        self.payment = payment\n        self.repo = repo\n        self.notifier = notifier\n        \n    def process(self, order):\n        total = self.calculator.calculate(order.items)\n        self.payment.pay(total)\n        self.repo.save(order)\n        self.notifier.send_receipt(order)\n\n# Usage: Inject dependencies\nservice = OrderService(\n    StandardCalculator(),\n    PayPal(),\n    SqlRepository(),\n    EmailNotifier()\n)' },
            { type: 'code', language: 'java', title: '✅ Step 3: Dependency Inversion — Java', content: '// Depend on abstractions, not concrete classes\nclass OrderService {\n    private OrderCalculator calculator;\n    private PaymentStrategy payment;\n    private OrderRepository repo;\n    private NotificationService notifier;\n\n    public OrderService(OrderCalculator calculator, PaymentStrategy payment, OrderRepository repo, NotificationService notifier) {\n        this.calculator = calculator;\n        this.payment = payment;\n        this.repo = repo;\n        this.notifier = notifier;\n    }\n\n    public void process(Order order) {\n        double total = calculator.calculate(order.getItems());\n        payment.pay(total);\n        repo.save(order);\n        notifier.sendReceipt(order);\n    }\n}' },
            {
                type: 'quiz',
                question: 'In the refactored code (Dependency Inversion), why do we pass interfaces (like PaymentStrategy) into the constructor instead of creating "new CreditCard()" inside?',
                options: ['To make the code shorter', 'To allow testing with mocks and swapping implementations at runtime', 'Because interfaces are faster than classes', 'To hide the code from the user'],
                correctIndex: 1,
                explanation: 'Dependency Injection allows loose coupling. We can inject a "MockPayment" for testing or "BitcoinPayment" at runtime without changing the OrderService code.'
            },
            { type: 'tip', variant: 'interview', content: 'If you see a class doing "infrastructure" work (SQL queries, API calls) AND "business logic" (tax calculation, rules), it violates SRP. Separate them immediately.' },
        ],
    },
    {
        id: 'uml-class-diagrams',
        title: 'UML & Class Diagrams',
        unit: 1,
        duration: '10 min',
        icon: 'architecture',
        sections: [
            { type: 'text', title: 'Visual Communication', content: 'In LLD interviews, you\'ll draw class diagrams on a whiteboard. You don\'t need formal UML perfection — but you need to clearly show **classes, relationships, and key methods**.' },
            {
                type: 'comparison', title: 'Relationship Breakdown', headers: ['Relationship', 'Strength', 'Analogy', 'Code'],
                rows: [
                    ['Association', 'Weak', 'Teacher uses a Chalk', '`class Teacher { void teach(Chalk c) { ... } }`'],
                    ['Aggregation', 'Medium', 'Team has Players', '`class Team { List<Player> players; }` (Players live on if Team dissolves)'],
                    ['Composition', 'Strong', 'House has Rooms', '`class House { List<Room> rooms; }` (Rooms die if House is destroyed)'],
                    ['Inheritance', 'Very Strong', 'Dog is an Animal', '`class Dog extends Animal { ... }`'],
                ]
            },
            { type: 'diagram', title: 'Example Class Diagram', content: '```\n┌──────────────────┐\n│     «interface»   │\n│    Vehicle        │\n├──────────────────┤\n│ + start(): void  │\n│ + stop(): void   │\n│ + getSpeed(): int│\n└────────△─────────┘\n         │ implements\n    ┌────┴──────┐\n    │           │\n┌───┴───┐   ┌──┴────┐\n│  Car  │   │ Truck │\n├───────┤   ├───────┤\n│-engine│   │-engine│\n│-gear  │   │-cargo │\n├───────┤   ├───────┤\n│+drive │   │+load  │\n└───────┘   └───────┘\n```' },
            { type: 'tip', variant: 'pro-tip', content: 'In interviews, draw the class diagram BEFORE coding. Show: class names, key fields (with access modifiers), key methods, and relationship arrows. This 5-minute diagram saves 15 minutes of confused coding.' },
            {
                type: 'quiz',
                question: 'Which relationship type represents "Strong Ownership" where the child object (e.g., Room) cannot exist without the parent object (e.g., House)?',
                options: ['Association (uses-a)', 'Aggregation (has-a, weak)', 'Composition (has-a, strong)', 'Inheritance (is-a)'],
                correctIndex: 2,
                explanation: 'Composition implies that the child lifecycle is managed by the parent. If the House is destroyed, the Rooms are destroyed too. Aggregation implies the child can exist independently (e.g., Team & Players).'
            },
        ],
    },

    // ═══════════════════════════════════════════════════════
    //  UNIT 2: DESIGN PATTERNS
    // ═══════════════════════════════════════════════════════
    {
        id: 'creational-patterns',
        title: 'Creational Patterns',
        unit: 2,
        duration: '18 min',
        icon: 'architecture',
        sections: [
            { type: 'text', title: 'How Objects Are Created', content: 'Creational patterns abstract the instantiation process. They help make a system independent of how its objects are created, composed, and represented.' },
            {
                type: 'concept-card', title: 'The Patterns', items: [
                    { term: 'Singleton', definition: 'Exactly one instance of a class. Used for: database connections, configuration managers, thread pools.' },
                    { term: 'Factory Method', definition: 'Delegate object creation to subclasses. Used for: creating objects when exact type depends on input.' },
                    { term: 'Abstract Factory', definition: 'Create families of related objects. Used for: UI toolkit (create button + checkbox that match a theme).' },
                    { term: 'Builder', definition: 'Construct complex objects step by step. Used for: objects with many optional parameters.' },
                    { term: 'Prototype', definition: 'Clone existing objects. Used for: expensive-to-create objects, when you need copies with slight variations.' },
                ]
            },
            { type: 'code', language: 'python', title: 'Singleton — Python (Thread-Safe)', content: 'import threading\n\nclass DatabaseConnection:\n    _instance = None\n    _lock = threading.Lock()\n    \n    def __new__(cls, *args, **kwargs):\n        if cls._instance is None:\n            with cls._lock:  # Thread-safe\n                if cls._instance is None:  # Double-check\n                    cls._instance = super().__new__(cls)\n        return cls._instance' },
            { type: 'code', language: 'java', title: 'Singleton — Java (Thread-Safe)', content: 'public class DatabaseConnection {\n    private static volatile DatabaseConnection instance;\n\n    private DatabaseConnection() {} // Private constructor\n\n    public static DatabaseConnection getInstance() {\n        if (instance == null) {\n            synchronized (DatabaseConnection.class) {\n                if (instance == null) { // Double-checked locking\n                    instance = new DatabaseConnection();\n                }\n            }\n        }\n        return instance;\n    }\n}' },
            { type: 'code', language: 'python', title: 'Factory Method', content: 'from abc import ABC, abstractmethod\n\nclass Notification(ABC):\n    @abstractmethod\n    def send(self, message: str) -> bool: ...\n\nclass EmailNotification(Notification):\n    def send(self, message): return True  # Email logic\n\nclass SMSNotification(Notification):\n    def send(self, message): return True  # SMS logic\n\nclass PushNotification(Notification):\n    def send(self, message): return True  # Push logic\n\nclass NotificationFactory:\n    _registry = {\n        "email": EmailNotification,\n        "sms": SMSNotification,\n        "push": PushNotification,\n    }\n    \n    @classmethod\n    def create(cls, channel: str) -> Notification:\n        klass = cls._registry.get(channel)\n        if not klass:\n            raise ValueError(f"Unknown channel: {channel}")\n        return klass()\n    \n    @classmethod\n    def register(cls, channel: str, klass):\n        cls._registry[channel] = klass  # OCP: extend without modifying\n\n# Usage\nnotif = NotificationFactory.create("email")\nnotif.send("Hello!")' },
            { type: 'code', language: 'java', title: 'Factory Method — Java', content: 'abstract class Notification {\n    public abstract void send(String message);\n}\nclass EmailNotification extends Notification {\n    public void send(String msg) { System.out.println("Email: " + msg); }\n}\nclass SMSNotification extends Notification {\n    public void send(String msg) { System.out.println("SMS: " + msg); }\n}\n\nclass NotificationFactory {\n    public static Notification create(String type) {\n        if (type.equals("email")) return new EmailNotification();\n        if (type.equals("sms")) return new SMSNotification();\n        throw new IllegalArgumentException("Unknown type");\n    }\n}' },
            { type: 'code', language: 'python', title: 'Builder — Complex Object Construction', content: 'class QueryBuilder:\n    def __init__(self):\n        self._table = None\n        self._conditions = []\n        self._order_by = None\n        self._limit = None\n        self._columns = ["*"]\n    \n    def select(self, *columns):\n        self._columns = list(columns)\n        return self  # Return self for chaining\n    \n    def from_table(self, table: str):\n        self._table = table\n        return self\n    \n    def where(self, condition: str):\n        self._conditions.append(condition)\n        return self\n    \n    def order_by(self, column: str, direction="ASC"):\n        self._order_by = f"{column} {direction}"\n        return self\n    \n    def limit(self, n: int):\n        self._limit = n\n        return self\n    \n    def build(self) -> str:\n        query = f"SELECT {\', \'.join(self._columns)} FROM {self._table}"\n        if self._conditions:\n            query += f" WHERE {\' AND \'.join(self._conditions)}"\n        if self._order_by:\n            query += f" ORDER BY {self._order_by}"\n        if self._limit:\n            query += f" LIMIT {self._limit}"\n        return query\n\n# Usage — readable and flexible\nquery = (QueryBuilder()\n    .select("name", "email")\n    .from_table("users")\n    .where("age > 18")\n    .where("active = true")\n    .order_by("name")\n    .limit(50)\n    .build())\n# → "SELECT name, email FROM users WHERE age > 18 AND active = true ORDER BY name ASC LIMIT 50"' },
            { type: 'code', language: 'java', title: 'Builder — Java', content: 'class User {\n    private String name; // required\n    private int age;     // optional\n    private String phone;// optional\n\n    private User(Builder b) {\n        this.name = b.name;\n        this.age = b.age;\n        this.phone = b.phone;\n    }\n\n    public static class Builder {\n        private String name;\n        private int age;\n        private String phone;\n\n        public Builder(String name) { this.name = name; }\n        public Builder age(int age) { this.age = age; return this; }\n        public Builder phone(String phone) { this.phone = phone; return this; }\n        public User build() { return new User(this); }\n    }\n}\n// Usage: User u = new User.Builder("John").age(30).build();' },
            {
                type: 'quiz',
                question: 'When should you use the Builder pattern instead of a Constructor with many parameters?',
                options: ['When object creation is expensive', 'When there are many optional parameters or the object construction is complex', 'When you want to reuse existing objects', 'When you want to hide the class constructor'],
                correctIndex: 1,
                explanation: 'Builder is ideal when you face the "Telescoping Constructor" problem (constructors with 5+ parameters, many nulls). It makes client code readable: .setA().setB().build().'
            },
        ],
    },
    {
        id: 'structural-patterns',
        title: 'Structural Patterns',
        unit: 2,
        duration: '15 min',
        icon: 'architecture',
        sections: [
            { type: 'text', title: 'How Classes Are Composed', content: 'Structural patterns deal with object composition — how classes and objects form larger structures while keeping them flexible and efficient.' },
            {
                type: 'concept-card', title: 'Key Patterns', items: [
                    { term: 'Adapter', definition: 'Convert one interface to another. Like a power adapter — makes incompatible things work together.' },
                    { term: 'Decorator', definition: 'Add behavior to objects dynamically without changing their class. Like adding toppings to a pizza.' },
                    { term: 'Facade', definition: 'Simple interface to a complex subsystem. Like a universal remote for your entire home theater.' },
                    { term: 'Proxy', definition: 'Control access to an object. Used for: lazy loading, caching, access control, logging.' },
                    { term: 'Composite', definition: 'Treat individual objects and compositions uniformly. Like files and folders — both are "filesystem items."' },
                ]
            },
            { type: 'code', language: 'python', title: 'Adapter — Python', content: 'class OldSystem:\n    def specific_request(self): return "Old System"\n\nclass NewInterface(ABC):\n    @abstractmethod\n    def request(self): ...\n\nclass Adapter(NewInterface):\n    def __init__(self, old: OldSystem):\n        self.old = old\n    def request(self):\n        return self.old.specific_request()' },
            { type: 'code', language: 'java', title: 'Adapter — Java', content: 'class OldSystem {\n    public String specificRequest() { return "Old System"; }\n}\ninterface NewInterface {\n    String request();\n}\nclass Adapter implements NewInterface {\n    private OldSystem old;\n    public Adapter(OldSystem old) { this.old = old; }\n    public String request() { return old.specificRequest(); }\n}' },
            { type: 'code', language: 'python', title: 'Decorator — Python', content: 'class DataSource(ABC):\n    @abstractmethod\n    def write(self, data: str): ...\n\nclass FileDataSource(DataSource):\n    def write(self, data): ...\n\nclass EncryptionDecorator(DataSource):\n    def __init__(self, source: DataSource):\n        self._wrapped = source\n    def write(self, data):\n        self._wrapped.write(self._encrypt(data))' },
            { type: 'code', language: 'java', title: 'Decorator — Java', content: 'interface DataSource {\n    void writeData(String data);\n}\n\nclass FileDataSource implements DataSource {\n    public void writeData(String data) { ... }\n}\n\nclass DataSourceDecorator implements DataSource {\n    protected DataSource wrappee;\n    \n    public DataSourceDecorator(DataSource source) {\n        this.wrappee = source;\n    }\n    \n    public void writeData(String data) {\n        wrappee.writeData(data);\n    }\n}\n\nclass EncryptionDecorator extends DataSourceDecorator {\n    public EncryptionDecorator(DataSource source) { super(source); }\n    \n    @Override\n    public void writeData(String data) {\n        super.writeData(encrypt(data));\n    }\n}' },
            { type: 'tip', variant: 'interview', content: 'When you need to add features to a class without changing it, use Decorator. Common in LLD: adding logging, caching, retry logic, or validation to existing services. It\'s the embodiment of the Open/Closed Principle.' },
            {
                type: 'quiz',
                question: 'Which pattern would you use to connect a new "AnalyticsService" to a legacy "ThirdPartyLogger" that has a different method signature?',
                options: ['Facade', 'Adapter', 'Decorator', 'Proxy'],
                correctIndex: 1,
                explanation: 'Adapter is designed to bridge incompatible interfaces, making classes work together that otherwise couldn\'t.'
            },
        ],
    },
    {
        id: 'behavioral-patterns',
        title: 'Behavioral Patterns',
        unit: 2,
        duration: '18 min',
        icon: 'architecture',
        sections: [
            { type: 'text', title: 'How Objects Interact', content: 'Behavioral patterns manage algorithms, responsibilities, and communication between objects.' },
            {
                type: 'concept-card', title: 'Key Patterns', items: [
                    { term: 'Observer', definition: 'One-to-many dependency. When one object changes, all dependents are notified. Events, pub-sub, UI updates.' },
                    { term: 'Strategy', definition: 'Define a family of algorithms and make them interchangeable. Sorting, payment, routing, pricing.' },
                    { term: 'Command', definition: 'Encapsulate a request as an object. Enables undo/redo, queuing, logging. Text editors, transactions.' },
                    { term: 'State', definition: 'Object behavior changes based on internal state. Vending machines, order status, game characters.' },
                    { term: 'Template Method', definition: 'Define algorithm skeleton in base class, let subclasses fill in steps. Data parsers, game loops.' },
                ]
            },
            { type: 'code', language: 'python', title: 'Observer Pattern — Python', content: 'class StockMarket:\n    def __init__(self):\n        self._observers = []\n    \n    def attach(self, observer): self._observers.append(observer)\n    \n    def set_price(self, price):\n        for obs in self._observers:\n            obs.update(price)' },
            { type: 'code', language: 'java', title: 'Observer Pattern — Java', content: 'interface Observer {\n    void update(float price);\n}\n\nclass StockMarket {\n    private List<Observer> observers = new ArrayList<>();\n\n    public void addObserver(Observer o) {\n        observers.add(o);\n    }\n\n    public void setPrice(float price) {\n        for (Observer o : observers) {\n            o.update(price);\n        }\n    }\n}\n\n// Usage\nmarket.addObserver(price -> System.out.println("Price: " + price));' },
            { type: 'code', language: 'python', title: 'Strategy Pattern — Python', content: 'class PricingStrategy(ABC):\n    @abstractmethod\n    def calculate(self, base_price: float) -> float: ...\n\nclass RegularPricing(PricingStrategy):\n    def calculate(self, base_price): return base_price\n\nclass PremiumPricing(PricingStrategy):\n    def calculate(self, base_price): return base_price * 0.8  # 20% discount\n\nclass RideService:\n    def __init__(self, pricing: PricingStrategy):\n        self._pricing = pricing\n    \n    def calculate_fare(self, distance: float) -> float:\n        return self._pricing.calculate(distance * 2.50)' },
            { type: 'code', language: 'java', title: 'Strategy Pattern — Java', content: 'interface PricingStrategy {\n    double calculate(double price);\n}\n\nclass RegularPricing implements PricingStrategy {\n    public double calculate(double price) { return price; }\n}\n\nclass PremiumPricing implements PricingStrategy {\n    public double calculate(double price) { return price * 0.8; }\n}\n\nclass RideService {\n    private PricingStrategy strategy;\n    \n    public RideService(PricingStrategy strategy) {\n        this.strategy = strategy;\n    }\n    \n    public double calculateFare(double distance) {\n        return strategy.calculate(distance * 2.50);\n    }\n}' },
            { type: 'tip', variant: 'interview', content: 'Strategy + Factory is the most common pattern combo in LLD interviews. If you see an if/elif chain choosing between different algorithms, immediately think Strategy pattern.' },
            {
                type: 'deep-dive',
                title: 'Factory vs. Strategy Patterns',
                content: `Candidates often confuse these two. Here's the difference:

**Factory (Creation):**
*   **Purpose:** Hides *how* an object is created.
*   **When:** You don't know *what* exact class you need until runtime.
*   **Example:** \`VehicleFactory.create('truck')\` gives you a \`Truck\` object.

**Strategy (Behavior):**
*   **Purpose:** Hides *how* an algorithm works.
*   **When:** You want to swap *how* something is done at runtime.
*   **Example:** \`Navigator.setRouteStrategy(FastestRoute())\` vs \`Navigator.setRouteStrategy(ScenicRoute())\`.`
            },
            {
                type: 'quiz',
                question: 'Which behavioral pattern is used to implement a subscription mechanism (like a YouTuber notifying subscribers of a new video)?',
                options: ['Strategy', 'Observer', 'Command', 'Iterator'],
                correctIndex: 1,
                explanation: 'The Observer pattern defines a one-to-many dependency so that when one object changes state, all its dependents are notified and updated automatically.'
            },
        ],
    },
    {
        id: 'pattern-decision-tree',
        title: 'Choosing the Right Pattern',
        unit: 2,
        duration: '10 min',
        icon: 'architecture',
        sections: [
            { type: 'text', title: 'Pattern Selection Guide', content: 'Don\'t memorize patterns — learn when to apply them. Here\'s a decision framework:' },
            { type: 'diagram', title: 'Decision Tree', content: '```\nWhat problem are you solving?\n├── "I need exactly one instance"\n│   └── Singleton\n├── "I need to create objects without specifying exact class"\n│   ├── One product → Factory Method\n│   └── Family of products → Abstract Factory\n├── "Object has many optional parameters"\n│   └── Builder\n├── "I need to add behavior without modifying class"\n│   └── Decorator\n├── "I need a simple interface to a complex system"\n│   └── Facade\n├── "I need to notify multiple objects of changes"\n│   └── Observer\n├── "I need interchangeable algorithms"\n│   └── Strategy\n├── "Object behavior changes with its state"\n│   └── State\n├── "I need undo/redo or command queuing"\n│   └── Command\n└── "I want to treat individual + groups uniformly"\n    └── Composite\n```' },
            {
                type: 'comparison', title: 'Pattern Quick Reference', headers: ['Pattern', 'Problem', 'Real-World Example'],
                rows: [
                    ['Singleton', 'Need exactly one instance', 'Database connection pool'],
                    ['Factory', 'Create objects by type', 'Payment method selection'],
                    ['Builder', 'Complex object construction', 'SQL query builder, HTTP request builder'],
                    ['Observer', 'Notify on state change', 'Event system, stock price alerts'],
                    ['Strategy', 'Swap algorithms', 'Sorting, pricing, routing'],
                    ['Decorator', 'Add behavior dynamically', 'Logging, caching, encryption wrappers'],
                    ['Command', 'Encapsulate operations', 'Undo/redo, transaction logs'],
                    ['State', 'Behavior varies by state', 'Order status, traffic light, vending machine'],
                    ['Adapter', 'Bridge incompatible interfaces', 'Legacy system integration'],
                    ['Facade', 'Simplify complex system', 'Library API, SDK wrapper'],
                ]
            },
            {
                type: 'quiz',
                question: 'Your system has a complex set of library classes for video processing. You want to provide a simple "process(file)" method to your users that hides all the internal complexity. Which pattern is best?',
                options: ['Adapter', 'Proxy', 'Facade', 'Decorator'],
                correctIndex: 2,
                explanation: 'The Facade pattern provides a simplified interface to a complex subsystem. While Adapter bridges incompatible interfaces, Facade simplifies a large set of interfaces into one.'
            },
        ],
    },

    // ═══════════════════════════════════════════════════════
    //  UNIT 3: ADVANCED CONCEPTS
    // ═══════════════════════════════════════════════════════
    {
        id: 'concurrency-thread-safety',
        title: 'Concurrency & Thread Safety',
        unit: 3,
        duration: '18 min',
        icon: 'code',
        sections: [
            { type: 'text', title: 'The Hardest Part of LLD', content: 'Concurrency is where most candidates struggle. If your LLD involves multiple users or background processing, interviewers WILL ask: "Is this thread-safe?"' },
            {
                type: 'quiz',
                question: 'What happens if Thread A holds Lock 1 and waits for Lock 2, while Thread B holds Lock 2 and waits for Lock 1?',
                options: ['Race Condition', 'Deadlock', 'Starvation', 'Livelock'],
                correctIndex: 1,
                explanation: 'This is a classic Deadlock. Neither thread can proceed, and the program freezes forever.'
            },
            { type: 'code', language: 'python', title: 'Producer-Consumer Pattern', content: 'import threading\nfrom queue import Queue\n\nclass TaskQueue:\n    def __init__(self, num_workers: int = 4):\n        self._queue = Queue(maxsize=100)\n        self._workers = []\n        for _ in range(num_workers):\n            t = threading.Thread(target=self._worker, daemon=True)\n            t.start()\n            self._workers.append(t)\n    \n    def _worker(self):\n        while True:\n            task = self._queue.get()  # Blocks until item available\n            try:\n                task.execute()\n            finally:\n                self._queue.task_done()\n    \n    def submit(self, task):\n        self._queue.put(task)  # Blocks if queue is full\n    \n    def wait_completion(self):\n        self._queue.join()  # Block until all tasks done\n\n# Usage\nqueue = TaskQueue(num_workers=4)\nfor task in tasks:\n    queue.submit(task)\nqueue.wait_completion()' },
            { type: 'code', language: 'java', title: 'Producer-Consumer — Java', content: 'import java.util.concurrent.*;\n\nclass TaskQueue {\n    private BlockingQueue<Runnable> queue;\n\n    public TaskQueue(int capacity) {\n        this.queue = new ArrayBlockingQueue<>(capacity);\n    }\n\n    public void submit(Runnable task) throws InterruptedException {\n        queue.put(task); // Blocks if full\n    }\n\n    public void startWorkers(int numWorkers) {\n        for (int i = 0; i < numWorkers; i++) {\n            new Thread(() -> {\n                try {\n                    while (true) {\n                        Runnable task = queue.take(); // Blocks if empty\n                        task.run();\n                    }\n                } catch (InterruptedException e) {\n                    Thread.currentThread().interrupt();\n                }\n            }).start();\n        }\n    }\n}' },
            { type: 'tip', variant: 'interview', content: 'When designing something like a rate limiter, booking system, or cache — always address thread safety. Say: "This needs to be thread-safe because multiple requests handle the same counter concurrently. I\'d use an atomic compare-and-swap here instead of a lock for better throughput."' },
        ],
    },
    {
        id: 'api-design-clean-code',
        title: 'API Design & Clean Code',
        unit: 3,
        duration: '12 min',
        icon: 'code',
        sections: [
            { type: 'text', title: 'Code That Speaks', content: 'In LLD interviews, **how** you write code matters as much as what you write. Clean code principles make your solution readable, testable, and extensible.' },
            {
                type: 'concept-card', title: 'Clean Code Principles', items: [
                    { term: 'Meaningful Names', definition: 'calculateMonthlyRevenue() not calc(). Users not data. isActive not flag.' },
                    { term: 'Small Functions', definition: 'Each function does ONE thing. If it\'s > 20 lines, split it.' },
                    { term: 'DRY', definition: 'Don\'t Repeat Yourself. Extract shared logic into functions.' },
                    { term: 'Fail Fast', definition: 'Validate inputs at the boundary. Throw early, catch at the appropriate level.' },
                    { term: 'Immutability', definition: 'Prefer immutable objects when possible. Eliminates entire classes of bugs.' },
                ]
            },
            { type: 'text', title: 'RESTful API Design', content: '```\nGET    /api/users           → List users\nGET    /api/users/123        → Get user 123\nPOST   /api/users            → Create user\nPUT    /api/users/123        → Update user 123\nDELETE /api/users/123        → Delete user 123\nGET    /api/users/123/orders → Get user\'s orders\n```\n\n**Good practices:**\n- Use nouns, not verbs: `/users` not `/getUsers`\n- Use plural: `/users` not `/user`\n- Nest logically: `/users/123/orders`\n- Use query params for filtering: `/users?active=true&role=admin`\n- Version your API: `/api/v1/users`\n- Return proper HTTP status codes: 200, 201, 400, 404, 500' },
            {
                type: 'quiz',
                question: 'Which HTTP method should be used to UPDATE an existing resource idempotently?',
                options: ['POST', 'GET', 'PUT', 'DELETE'],
                correctIndex: 2,
                explanation: 'PUT is idempotent (calling it multiple times has the same effect as calling it once) and is used for updates. POST is not idempotent (calling it multiple times creates multiple resources).'
            },
        ],
    },
    {
        id: 'testing-edge-cases',
        title: 'Testing & Edge Cases',
        unit: 3,
        duration: '10 min',
        icon: 'check',
        sections: [
            { type: 'text', title: 'Think About What Breaks', content: 'In LLD interviews, after implementing your solution, interviewers often ask about testing and edge cases. Having a testing mindset shows engineering maturity.' },
            {
                type: 'concept-card', title: 'Testing Strategies', items: [
                    { term: 'Unit Tests', definition: 'Test individual classes/methods in isolation. Mock dependencies. Fast, run on every change.' },
                    { term: 'Integration Tests', definition: 'Test how components work together. Use real database, real services. Slower, run before deploy.' },
                    { term: 'Edge Cases', definition: 'Empty inputs, max values, concurrent access, null/undefined, duplicate entries, boundary conditions.' },
                ]
            },
            { type: 'text', title: 'Edge Cases Checklist', content: '**Always consider:**\n- What if the input is empty, null, or negative?\n- What if the collection is full? Empty?\n- What if two users do the same thing at the same time?\n- What if the external service is down?\n- What happens at midnight? On Feb 29? On New Year?\n- What if the input is extremely large (1GB file, 1M items)?\n- What if the user does things out of order?\n- Unicode? Special characters? SQL injection attempts?' },
            {
                type: 'quiz',
                question: 'When testing a function that calculates limits, testing "0" and "MAX_INT" is an example of what?',
                options: ['Unit Testing', 'Boundary Testing (Edge Cases)', 'Integration Testing', 'Regression Testing'],
                correctIndex: 1,
                explanation: 'Boundary testing focuses on extreme values (min, max, empty, likely-to-fail values) because bugs most often hide at the edges of valid input ranges.'
            },
        ],
    },

    // ═══════════════════════════════════════════════════════
    //  UNIT 4: COMPLETE WALKTHROUGHS
    // ═══════════════════════════════════════════════════════
    {
        id: 'design-parking-lot',
        title: 'Low-Level Design: Parking Lot',
        unit: 4,
        duration: '25 min',
        icon: 'architecture',
        practiceLink: 'parking-lot',
        sections: [
            { type: 'text', title: 'The Classic LLD Interview Problem', content: 'Parking Lot is the most common LLD interview question. It tests: entity identification, relationships, design patterns, and edge case handling.' },
            { type: 'text', title: 'Step 1: Requirements', content: '**Functional:**\n- Multiple floors, each with many parking spots\n- Different spot types: Compact, Regular, Large\n- Different vehicle types: Motorcycle, Car, Truck\n- Ticket-based entry/exit\n- Hourly rate pricing\n- Display available spots per floor\n\n**Edge Cases:**\n- Lot is full → reject entry\n- Vehicle too big for remaining spots\n- Payment failure\n- Power outage (state recovery)' },
            { type: 'diagram', title: 'Step 2: Class Diagram', content: '```\n┌──────────────────┐        ┌──────────────┐\n│   ParkingLot     │───────▶│    Floor     │\n│ ─────────────    │ 1    * │ ──────────── │\n│ +addFloor()      │        │ +getSpots()  │\n│ +findSpot()      │        │ +available() │\n│ +processEntry()  │        └──────┬───────┘\n│ +processExit()   │               │ 1    *\n└──────────────────┘        ┌──────┴───────┐\n                            │  ParkingSpot │\n┌──────────────────┐        │ ──────────── │\n│    Vehicle       │◀───────│ -type        │\n│ ─────────────    │ 0..1   │ -isOccupied  │\n│ -licensePlate    │        │ +park()      │\n│ -type            │        │ +unpark()    │\n└──────────────────┘        └──────────────┘\n\n┌──────────────────┐\n│    Ticket        │\n│ ─────────────    │\n│ -entryTime       │\n│ -exitTime        │\n│ -vehicle         │\n│ -spot            │\n│ +calculateFee()  │\n└──────────────────┘\n```' },
            { type: 'code', language: 'python', title: 'Step 3: Core Implementation (Python)', content: 'from enum import Enum\nfrom datetime import datetime\nimport threading\n\nclass VehicleType(Enum):\n    MOTORCYCLE = 1\n    CAR = 2\n    TRUCK = 3\n\nclass SpotType(Enum):\n    COMPACT = 1    # Motorcycle only\n    REGULAR = 2    # Car or Motorcycle\n    LARGE = 3      # Any vehicle\n\nclass ParkingSpot:\n    def __init__(self, spot_id: str, spot_type: SpotType, floor: int):\n        self.spot_id = spot_id\n        self.spot_type = spot_type\n        self.floor = floor\n        self._vehicle = None\n        self._lock = threading.Lock()\n    \n    @property\n    def is_available(self) -> bool:\n        return self._vehicle is None\n    \n    def can_fit(self, vehicle_type: VehicleType) -> bool:\n        fit_map = {\n            SpotType.COMPACT: [VehicleType.MOTORCYCLE],\n            SpotType.REGULAR: [VehicleType.MOTORCYCLE, VehicleType.CAR],\n            SpotType.LARGE: [VehicleType.MOTORCYCLE, VehicleType.CAR, VehicleType.TRUCK],\n        }\n        return vehicle_type in fit_map[self.spot_type]\n    \n    def park(self, vehicle) -> bool:\n        with self._lock:\n            if not self.is_available:\n                return False\n            if not self.can_fit(vehicle.vehicle_type):\n                return False\n            self._vehicle = vehicle\n            return True\n    \n    def unpark(self):\n        with self._lock:\n            vehicle = self._vehicle\n            self._vehicle = None\n            return vehicle\n\nclass ParkingLot:\n    _instance = None  # Singleton\n    \n    def __init__(self, name: str, hourly_rate: float = 5.0):\n        self.name = name\n        self._hourly_rate = hourly_rate\n        self._spots = []  # All spots\n        self._active_tickets = {}  # license_plate → Ticket\n        self._lock = threading.Lock()\n    \n    def find_spot(self, vehicle_type: VehicleType):\n        for spot in self._spots:\n            if spot.is_available and spot.can_fit(vehicle_type):\n                return spot\n        return None  # Lot full for this vehicle type\n    \n    def process_entry(self, vehicle) -> "Ticket":\n        with self._lock:\n            spot = self.find_spot(vehicle.vehicle_type)\n            if not spot:\n                raise Exception("No available spot")\n            spot.park(vehicle)\n            ticket = Ticket(vehicle, spot)\n            self._active_tickets[vehicle.license_plate] = ticket\n            return ticket\n    \n    def process_exit(self, license_plate: str) -> float:\n        with self._lock:\n            ticket = self._active_tickets.pop(license_plate)\n            ticket.close()\n            ticket.spot.unpark()\n            return ticket.calculate_fee(self._hourly_rate)' },
            { type: 'code', language: 'java', title: 'Step 3: Core Implementation (Java)', content: 'public enum VehicleType {\n    MOTORCYCLE, CAR, TRUCK\n}\n\npublic class ParkingSpot {\n    private final String id;\n    private final SpotType type;\n    private Vehicle vehicle;\n    private final ReentrantLock lock = new ReentrantLock();\n\n    public boolean park(Vehicle v) {\n        lock.lock();\n        try {\n            if (!isAvailable() || !canFit(v)) return false;\n            this.vehicle = v;\n            return true;\n        } finally {\n            lock.unlock();\n        }\n    }\n}' },
            { type: 'text', title: 'Step 4: Deep Dive — Concurrency', content: '**Why ReentrantLock?**\nIn a real-world system, multiple entry terminals might try to assign the SAME spot simultaneously. Simple boolean checks aren\'t enough.\n\n**Option 1: Synchronized Method**\n- `public synchronized boolean park()`\n- Safe, but locks the *entire* object. Low throughput if we lock the whole Parking Lot to find a spot.\n\n**Option 2: Fine-Grained Locking (Better)**\n- Lock individual spots (as shown in Java code).\n- Or use `ConcurrentHashMap` for the ticket registry.\n- Use `AtomicInteger` for available spot counts.' },
            {
                type: 'deep-dive',
                title: 'Extensibility: Electric Vehicles',
                content: `**Interviewer:** "How would you support Electric Vehicle (EV) charging spots?"
                
**Good Answer:** "Inheritance might be better here. \`ElectricSpot\` extends \`ParkingSpot\` and adds \`charge()\` method. Or use Composition: \`ParkingSpot\` has-a \`ChargingStation\`.
Also, we need a billing system change: Charging fee + Parking fee."`
            },
            {
                type: 'quiz',
                question: 'In a multi-threaded Parking Lot system, what is the risk of using a simple "if (spot.isAvailable) { spot.park(vehicle) }" check?',
                options: ['Memory leak', 'Race condition (two vehicles assigned to same spot)', 'Deadlock', 'Slow performance'],
                correctIndex: 1,
                explanation: 'This is a classic "Check-then-Act" race condition. Two threads could both see the spot as available and then both attempt to park their different vehicles in it. Atomic operations or locks are required.'
            },
        ],
    },
    {
        id: 'design-lru-cache',
        title: 'Low-Level Design: LRU Cache',
        unit: 4,
        duration: '20 min',
        icon: 'code',
        practiceLink: 'lru-cache',
        sections: [
            { type: 'text', title: 'Data Structures + Thread Safety', content: 'LRU Cache is a beautiful problem — it combines data structures knowledge (doubly-linked list + hash map) with system design thinking (thread safety, capacity management).' },
            { type: 'text', title: 'Requirements', content: '**Operations:**\n- `get(key)` → return value if exists, else -1. O(1).\n- `put(key, value)` → insert/update. If at capacity, evict least recently used. O(1).\n\n**Key insight:** We need O(1) for both lookup AND ordering. That requires TWO data structures:\n- **HashMap** → O(1) key lookup\n- **Doubly Linked List** → O(1) move-to-front, remove-from-end' },
            { type: 'code', language: 'python', title: 'Implementation (Python)', content: 'class Node:\n    def __init__(self, key=0, val=0):\n        self.key = key\n        self.val = val\n        self.prev = None\n        self.next = None\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self._capacity = capacity\n        self._cache = {}  # key → Node\n        # Dummy head and tail for easy boundary handling\n        self._head = Node()  # Most recently used\n        self._tail = Node()  # Least recently used\n        self._head.next = self._tail\n        self._tail.prev = self._head\n    \n    def _remove(self, node: Node):\n        """Remove node from linked list"""\n        node.prev.next = node.next\n        node.next.prev = node.prev\n    \n    def _add_to_front(self, node: Node):\n        """Add node right after head (most recent)"""\n        node.prev = self._head\n        node.next = self._head.next\n        self._head.next.prev = node\n        self._head.next = node\n    \n    def get(self, key: int) -> int:\n        if key not in self._cache:\n            return -1\n        node = self._cache[key]\n        self._remove(node)\n        self._add_to_front(node)  # Mark as recently used\n        return node.val\n    \n    def put(self, key: int, value: int):\n        if key in self._cache:\n            self._remove(self._cache[key])\n        node = Node(key, value)\n        self._cache[key] = node\n        self._add_to_front(node)\n        if len(self._cache) > self._capacity:\n            lru = self._tail.prev  # Evict least recent\n            self._remove(lru)\n            del self._cache[lru.key]' },
            { type: 'code', language: 'java', title: 'Implementation (Java LinkedHashMap)', content: '// The "Cheat Code" for LRU Cache in Java\nimport java.util.LinkedHashMap;\nimport java.util.Map;\n\npublic class LRUCache<K, V> extends LinkedHashMap<K, V> {\n    private final int capacity;\n\n    public LRUCache(int capacity) {\n        // true = access order (updates on read)\n        // false = insertion order (updates on write only)\n        super(capacity, 0.75f, true); \n        this.capacity = capacity;\n    }\n\n    @Override\n    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {\n        return size() > capacity; // Auto-evicts when full\n    }\n}' },
            { type: 'text', title: 'Complexity Analysis', content: '**Time Complexity:**\n- `get()`: O(1) - HashMap lookup + Linked List move\n- `put()`: O(1) - HashMap insert + Linked List add/remove\n\n**Space Complexity:**\n- O(Capacity) - To store nodes and map entries.' },
            {
                type: 'quiz',
                question: 'To make LRU Cache thread-safe, which approach provides the highest concurrency?',
                options: ['Synchronize every method (Coarse-grained)', 'Use ReadWriteLock', 'Use ConcurrentHashMap with Segmentation', 'Use a Global Lock'],
                correctIndex: 1,
                explanation: 'A `ReadWriteLock` allows multiple threads to READ (get) simultaneously, while only blocking for WRITE (put). Since caches are often read-heavy (90% reads), this significantly improves performance over a simple exclusive lock.'
            },
        ],
    },
    {
        id: 'design-elevator',
        title: 'Low-Level Design: Elevator System',
        unit: 4,
        duration: '20 min',
        icon: 'architecture',
        practiceLink: 'elevator-system',
        sections: [
            { type: 'text', title: 'State Machine + Scheduling', content: 'The elevator problem tests your ability to model states, transitions, and scheduling algorithms.' },
            { type: 'text', title: 'Key Design Decisions', content: '**State Machine:**\n```\nIDLE → MOVING_UP → IDLE\nIDLE → MOVING_DOWN → IDLE\nMOVING_UP → DOOR_OPEN → MOVING_UP\nMOVING_DOWN → DOOR_OPEN → MOVING_DOWN\n```\n\n**Scheduling Algorithm (SCAN/LOOK):**\n1. Continue in current direction picking up passengers along the way\n2. When no more requests in current direction, reverse\n3. Like a disk arm scanning — hence "elevator algorithm"\n\n**Design patterns used:**\n- **State:** Elevator behavior changes based on state (idle/moving/door-open)\n- **Strategy:** Different scheduling algorithms (FCFS, SCAN, LOOK)\n- **Observer:** Floor buttons notify the elevator controller' },
            { type: 'diagram', title: 'Class Structure', content: '```\n┌───────────────────┐    ┌────────────────┐\n│ ElevatorController│───▶│   Elevator     │\n│ ─────────────     │ 1 *│ ────────────── │\n│ +requestElevator()│    │ -currentFloor  │\n│ +assignRequest()  │    │ -optimize()       │    │ -state         │\n└───────────────────┘    │ +move()        │\n         │               │ +openDoor()    │\n         ▼               │ +addStop()     │\n┌───────────────────┐    └────────────────┘\n│   Request         │\n│ ─────────────     │\n│ -sourceFloor      │\n│ -destFloor        │\n│ -direction        │\n│ -timestamp        │\n└───────────────────┘\n```' },
            { type: 'code', language: 'java', title: 'State & Direction (Java)', content: 'enum Direction { UP, DOWN, IDLE }\nenum Status { IDLE, MOVING, DOOR_OPEN }\n\nclass Request implements Comparable<Request> {\n    int floor;\n    long timestamp;\n\n    public int compareTo(Request other) {\n        return Long.compare(this.timestamp, other.timestamp);\n    }\n}\n\nclass Elevator {\n    private int currentFloor;\n    private Direction direction;\n    private PriorityQueue<Request> upQueue;\n    private PriorityQueue<Request> downQueue;\n\n    public void addRequest(int floor) {\n        if (floor > currentFloor) upQueue.add(new Request(floor));\n        else downQueue.add(new Request(floor));\n    }\n}' },
            {
                type: 'deep-dive',
                title: 'Algorithm: SCAN vs FCFS',
                content: `** FCFS(First Come First Serve):**
            - Simple, but inefficient.
- Elevator goes 1 -> 10 -> 2 -> 9. Lots of zigzag.

** SCAN(Elevator Algorithm):**
            - Move in one direction(e.g., UP) servicing all requests until top.
- Then reverse(DOWN) service all requests until bottom.
- ** Why better ?** Minimizes seek time, prevents starvation for mid - floors.

** LOOK(Optimized SCAN):**
    - Like SCAN, but reverse immediately if no more requests in current direction(don't go to top/bottom unnecessarily).`
            },
            {
                type: 'quiz',
                question: 'Which design pattern is best for implementing different elevator scheduling algorithms?',
                options: ['Singleton', 'Strategy', 'Decorator', 'Adapter'],
                correctIndex: 1,
                explanation: 'The Strategy pattern allows you to swap algorithms (e.g., FCFS, LOOK, SCAN) at runtime without changing the Elevator class.'
            },
        ],
    },
    {
        id: 'design-chess',
        title: 'Low-Level Design: Chess Game',
        unit: 4,
        duration: '25 min',
        icon: 'architecture',
        practiceLink: 'chess',
        sections: [
            { type: 'text', title: 'Complex Entity Relationships', content: 'Chess tests your ability to model complex entity relationships, polymorphism, and game logic.' },
            { type: 'text', title: 'Key Entities', content: '**Classes:**\n- `Game` — manages turns, win conditions, game state\n- `Board` — 8×8 grid of cells\n- `Cell` — holds a piece (or empty)\n- `Piece` (abstract) — base class for all pieces\n- `King`, `Queen`, `Rook`, `Bishop`, `Knight`, `Pawn` — each with unique move logic\n- `Player` — has a color, collection of pieces\n- `Move` — from cell, to cell, captured piece\n\n**Key polymorphism:**\nEvery piece has `getValidMoves(board)` — returns list of valid cells. Each subclass implements different movement rules.' },
            { type: 'code', language: 'python', title: 'Piece Hierarchy (Python)', content: 'class Piece(ABC):\n    def __init__(self, color: Color, position: Cell):\n        self.color = color\n        self.position = position\n    \n    @abstractmethod\n    def get_valid_moves(self, board: "Board") -> list["Cell"]:\n        """Returns all legal moves for this piece"""\n        pass\n    \n    def can_move_to(self, cell: Cell, board: "Board") -> bool:\n        return cell in self.get_valid_moves(board)\n\nclass Knight(Piece):\n    def get_valid_moves(self, board):\n        moves = []\n        r, c = self.position.row, self.position.col\n        offsets = [(-2,-1),(-2,1),(-1,-2),(-1,2),(1,-2),(1,2),(2,-1),(2,1)]\n        for dr, dc in offsets:\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < 8 and 0 <= nc < 8:\n                cell = board.get_cell(nr, nc)\n                if cell.is_empty() or cell.piece.color != self.color:\n                    moves.append(cell)\n        return moves\n\nclass Rook(Piece):\n    def get_valid_moves(self, board):\n        return self._get_line_moves(board, [(0,1),(0,-1),(1,0),(-1,0)])\n    \n    def _get_line_moves(self, board, directions):\n        moves = []\n        for dr, dc in directions:\n            r, c = self.position.row + dr, self.position.col + dc\n            while 0 <= r < 8 and 0 <= c < 8:\n                cell = board.get_cell(r, c)\n                if cell.is_empty():\n                    moves.append(cell)\n                elif cell.piece.color != self.color:\n                    moves.append(cell)  # Can capture\n                    break\n                else:\n                    break  # Blocked by own piece\n                r, c = r + dr, c + dc\n        return moves' },
            { type: 'code', language: 'java', title: 'Piece Hierarchy (Java)', content: 'abstract class Piece {\n    protected boolean isWhite;\n    protected Cell cell;\n\n    public abstract List<Cell> getValidMoves(Board board);\n\n    public boolean canMove(Cell target, Board board) {\n        return getValidMoves(board).contains(target);\n    }\n}\n\nclass Knight extends Piece {\n    @Override\n    public List<Cell> getValidMoves(Board board) {\n        List<Cell> moves = new ArrayList<>();\n        int[][] offsets = {{-2,-1},{-2,1},{-1,-2},{-1,2},{1,-2},{1,2},{2,-1},{2,1}};\n        // ... Logic to check bounds and add cells\n        return moves;\n    }\n}' },
            {
                type: 'deep-dive',
                title: 'Complexity: Checkmate Detection',
                content: `**How to detect Checkmate?**
1. **Is King in Check?** If yes...
2. **Can King move?** Try all adjacent cells.
3. **Can Attacker be captured?** Can any friendly piece capture the attacker?
4. **Can Path be blocked?** Can any friendly piece move between attacker and King?

If ALL are false, then Checkmate.
This requires simulating moves on a *copy* of the board to see if the king is still in check.`
            },
            {
                type: 'quiz',
                question: 'How should you store the history of moves to implement Undo/Redo?',
                options: ['List<String>', 'Stack<MoveObject> (Command Pattern)', 'Array of Board States', 'Database Transaction Log'],
                correctIndex: 1,
                explanation: 'Using the Command Pattern (Stack of Move objects) allows you to easily pop the last move and reverse its effect (undo).'
            },
        ],
    },
    {
        id: 'design-tic-tac-toe',
        title: 'Low-Level Design: Tic-Tac-Toe',
        unit: 4,
        duration: '20 min',
        icon: 'architecture',
        practiceLink: 'tic-tac-toe',
        sections: [
            { type: 'text', title: 'The "Simple" Game', content: 'Don\'t be fooled—Tic-Tac-Toe is a perfect test of object modeling, Separation of Concerns, and extensibility (what if board size N=100?).' },
            { type: 'text', title: 'Requirements', content: '**Core:**\n- 2 Players (X and O)\n- 3x3 Grid\n- Detect Win (Row, Col, Diag) or Draw\n\n**Extensibility:**\n- N x N Board\n- N players?\n- Different win conditions?' },
            { type: 'diagram', title: 'Class Diagram', content: '```\n┌──────────────┐     1    1  ┌──────────────┐\n│     Game     │◇───────────▶│    Board     │\n├──────────────┤             ├──────────────┤\n│ -players[]   │             │ -grid[][]    │\n│ -currentTurn │             │ +move()      │\n│ -status      │             │ +checkWin()  │\n│ +play()      │             └──────────────┘\n       │ 2\n       ▼\n┌──────────────┐\n│    Player    │\n├──────────────┤\n│ -name        │\n│ -symbol (X/O)│\n└──────────────┘\n```' },
            {
                type: 'code',
                language: 'python',
                title: 'Optimized Win Check O(1)',
                content: 'class TicTacToe:\n    def __init__(self, n):\n        self.n = n\n        # O(1) tracking using counters instead of O(N^2) scan\n        self.rows = [0] * n\n        self.cols = [0] * n\n        self.diag = 0\n        self.anti_diag = 0\n        \n    def move(self, row, col, player): \n        # player 1 adds +1, player 2 adds -1\n        val = 1 if player == 1 else -1\n        \n        self.rows[row] += val\n        self.cols[col] += val\n        \n        if row == col:\n            self.diag += val\n        if row + col == self.n - 1:\n            self.anti_diag += val\n            \n        # Check if any counter reached N or -N\n        if abs(self.rows[row]) == self.n or \\\n           abs(self.cols[col]) == self.n or \\\n           abs(self.diag) == self.n or \\\n           abs(self.anti_diag) == self.n:\n            return player # WIN\n            \n        return 0 # No win yet'
            },
            {
                type: 'code',
                language: 'java',
                title: 'Tic-Tac-Toe — Java (O(1))',
                content: 'class TicTacToe {\n    private int[] rows, cols;\n    private int diag, antiDiag, n;\n\n    public TicTacToe(int n) {\n        this.n = n;\n        this.rows = new int[n];\n        this.cols = new int[n];\n    }\n\n    public int move(int row, int col, int player) {\n        int val = (player == 1) ? 1 : -1;\n        rows[row] += val;\n        cols[col] += val;\n        if (row == col) diag += val;\n        if (row + col == n - 1) antiDiag += val;\n\n        if (Math.abs(rows[row]) == n || Math.abs(cols[col]) == n || \n            Math.abs(diag) == n || Math.abs(antiDiag) == n) {\n            return player;\n        }\n        return 0;\n    }\n}'
            },
            { type: 'tip', variant: 'interview', content: 'The O(1) solution (tracking counts) is a "hired" answer. The O(N^2) solution (scanning the board every turn) is a "maybe" answer. Always look for the optimized approach.' },
            {
                type: 'quiz',
                question: 'What is the space complexity of the "Optimized Win Check" that uses Row/Col counters?',
                options: ['O(1)', 'O(N)', 'O(N^2)', 'O(log N)'],
                correctIndex: 1,
                explanation: 'We store two arrays of size N (rows and cols) and two variables (diagonals). Total space is O(N), which is much better than O(N^2) if you were storing many redundant states.'
            },
        ],
    },
    {
        id: 'design-bookstore',
        title: 'Low-Level Design: Online Bookstore',
        unit: 4,
        duration: '25 min',
        icon: 'architecture',
        practiceLink: 'online-bookstore',
        sections: [
            { type: 'text', title: 'E-Commerce Fundamentals', content: 'Design a system like Amazon Books. Focus on: Search, Catalog, Cart, and Order Management.' },
            { type: 'text', title: 'Key Entities', content: '- **Book:** Title, Author, Price, ISBN, Category\n- **Catalog:** Collection of books, supports search\n- **User:** Customer vs Admin\n- **Cart:** List of CartItems\n- **Order:** Created from Cart, has Status (Pending, Shipped)\n- **Payment:** Interface for CreditCard, PayPal' },
            { type: 'diagram', title: 'Class Relationships', content: '```\nUser 1──* Order 1──1 Payment\n         │\n         └──* OrderItem *──1 Book\n\nUser 1──1 Cart 1──* CartItem *──1 Book\n\nCatalog 1──* Book\n```' },
            { type: 'code', language: 'python', title: 'Search Interface (Specification Pattern)', content: 'class BookSearchSpec(ABC):\n    @abstractmethod\n    def is_satisfied_by(self, book: Book) -> bool: ...\n\nclass AuthorSpec(BookSearchSpec):\n    def __init__(self, author_name):\n        self.author = author_name\n    def is_satisfied_by(self, book):\n        return self.author in book.author\n\nclass CategorySpec(BookSearchSpec):\n    def __init__(self, category):\n        self.cat = category\n    def is_satisfied_by(self, book):\n        return self.cat == book.category\n\nclass AndSpec(BookSearchSpec):\n    def __init__(self, spec1, spec2):\n        self.s1 = spec1\n        self.s2 = spec2\n    def is_satisfied_by(self, book):\n        return self.s1.is_satisfied_by(book) and self.s2.is_satisfied_by(book)\n\n# Usage: Find "Sci-Fi" books by "Asimov"\nspec = AndSpec(CategorySpec("Sci-Fi"), AuthorSpec("Asimov"))\nresults = catalog.find(spec)' },
            { type: 'code', language: 'java', title: 'Bookstore Entities — Java', content: 'class Book {\n    String isbn, title, author;\n    double price;\n}\n\nclass Cart {\n    List<CartItem> items = new ArrayList<>();\n    void addItem(Book b, int qty) { items.add(new CartItem(b, qty)); }\n    double getTotal() { return items.stream().mapToDouble(i -> i.book.price * i.qty).sum(); }\n}\n\ninterface PaymentStrategy {\n    void pay(double amount);\n}\n\nclass Order {\n    User user;\n    List<OrderItem> items;\n    PaymentStrategy payment;\n    void process() { payment.pay(calculateTotal()); }\n}' },
            {
                type: 'quiz',
                question: 'Which design pattern is best for implementing many different ways to search for books (by author, by price, by category)?',
                options: ['Factory', 'Strategy', 'Specification Pattern', 'Singleton'],
                correctIndex: 2,
                explanation: 'The Specification Pattern allows you to combine simple search criteria (specs) into complex queries (using AND/OR) without bloating the Catalog class.'
            },
        ],
    },
    // ═══════════════════════════════════════════════════════
    //  UNIT 5: INTERVIEW MASTERY
    // ═══════════════════════════════════════════════════════
    {
        id: 'lld-interview-framework',
        title: 'Low-Level Design Framework',
        unit: 5,
        duration: '10 min',
        icon: 'foundations',
        sections: [
            { type: 'text', title: 'Your Step-by-Step Approach', content: 'Follow this framework in every LLD interview:' },
            { type: 'diagram', title: 'The Framework', content: '```\n1. CLARIFY (5 min)\n   └── Ask about: scope, features, constraints, users\n\n2. IDENTIFY ENTITIES (5 min)\n   └── List the key classes and their relationships\n\n3. DRAW CLASS DIAGRAM (5 min)\n   └── Show classes, key methods, relationships\n\n4. IMPLEMENT (20 min)\n   └── Start with core entities, then business logic\n\n5. HANDLE EDGE CASES (5 min)\n   └── Concurrency, error handling, boundary conditions\n\n6. DISCUSS EXTENSIBILITY (5 min)\n   └── "If we added X feature, how would the design change?"\n```' },
            { type: 'text', title: 'Communication Tips', content: '- **Think aloud** as you design classes\n- **Start with interfaces** before implementations\n- **Name things well** — class names should be nouns, methods should be verbs\n- **Call out patterns** — "I\'m using Strategy here because..."\n- **Address thread safety** if relevant\n- **Ask clarifying questions** — "Should a spot hold multiple motorcycles?"' },
            {
                type: 'quiz',
                question: 'What is the standard ideal time allocation for the "CLARIFY" phase in a 45-minute LLD interview?',
                options: ['15 minutes', '2 minutes', '5-7 minutes', '20 minutes'],
                correctIndex: 2,
                explanation: 'Spending 5-7 minutes clarifying requirements ensures you don\'t build the wrong thing. Don\'t rush it, but don\'t let it cut too deep into implementation time.'
            },
        ],
    },
    {
        id: 'lld-common-mistakes',
        title: 'Low-Level Design Anti-Patterns',
        unit: 5,
        duration: '8 min',
        icon: 'alert',
        sections: [
            { type: 'text', title: 'What Makes You Fail', content: '1. **God Classes** — One class that does everything. Break it up with SRP.\n2. **Primitive Obsession** — Using `string` for everything instead of proper types. Create `Email`, `Money`, `PhoneNumber` classes.\n3. **Deep Inheritance** — More than 2-3 levels deep = design smell. Prefer composition.\n4. **No Interfaces** — Coding to concrete classes instead of abstractions.\n5. **Ignoring Access Modifiers** — Making everything public. Use private fields + public methods.\n6. **No Error Handling** — Happy path only. What if input is null? Amount is negative?\n7. **If/Elif Chains** — Sign you need Strategy or Factory pattern.\n8. **Mutable Shared State** — Without proper synchronization = race conditions.\n9. **Not Considering Extensibility** — "What if we add a new vehicle type?" Should require minimal changes.\n10. **Skipping the Diagram** — Jumping to code without drawing classes first.' },
            { type: 'tip', variant: 'pro-tip', content: 'The interviewer\'s evaluation form typically has checkboxes for: "Used design patterns appropriately", "Followed SOLID", "Considered edge cases", "Code was clean and readable", "Considered extensibility." Make sure you hit all of these explicitly.' },
            {
                type: 'quiz',
                question: 'What is the term for the "Code Smell" where you use primitive types (like String or Int) to represent complex concepts (like a Currency or Email) instead of creating dedicated classes?',
                options: ['God Class', 'Primitive Obsession', 'Deep Inheritance', 'Shotgun Surgery'],
                correctIndex: 1,
                explanation: 'Primitive Obsession leads to logic being scattered across the codebase. Creating small value objects (like an "Email" class with its own validation) makes the code much cleaner and safer.'
            },
        ],
    },
]
