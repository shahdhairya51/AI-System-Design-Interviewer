# Complete Low-Level Design (LLD) Interview Guide
## The Ultimate Machine Coding & Object-Oriented Design Resource

---

## Table of Contents
1. [Introduction to LLD Interviews](#introduction)
2. [Object-Oriented Programming Fundamentals](#oop-fundamentals)
3. [SOLID Principles - The Foundation](#solid-principles)
4. [Design Patterns - Creational](#creational-patterns)
5. [Design Patterns - Structural](#structural-patterns)
6. [Design Patterns - Behavioral](#behavioral-patterns)
7. [Concurrency and Thread Safety](#concurrency)
8. [UML Diagrams and Documentation](#uml-diagrams)
9. [API Design and Clean Code](#api-design)
10. [Complete LLD Examples](#complete-examples)
11. [Interview Strategy and Best Practices](#interview-strategy)

---

# 1. Introduction to LLD Interviews {#introduction}

## What is Low-Level Design?

**Low-Level Design** focuses on:
- **Class and object design** - How to structure your code
- **Relationships between classes** - Inheritance, composition, aggregation
- **Code organization** - Clean, maintainable, extensible
- **Implementation details** - Actual working code, not just architecture

**Difference from High-Level Design:**
```
High-Level Design (HLD):
- How do we build Instagram for 1 billion users?
- Focus: Scalability, databases, caching, load balancing
- Output: Architecture diagram, technology choices

Low-Level Design (LLD):
- How do we code a parking lot system?
- Focus: Classes, methods, relationships, design patterns
- Output: Working code, class diagrams, clean implementation
```

## What Interviewers Look For

**1. Code Quality:**
```python
# ❌ Bad Code
def process(data):
    result = []
    for i in range(len(data)):
        if data[i] > 0:
            result.append(data[i] * 2)
    return result

# ✅ Good Code
def double_positive_numbers(numbers: List[int]) -> List[int]:
    """Returns a list of doubled values for all positive numbers."""
    return [num * 2 for num in numbers if num > 0]
```

**2. Design Principles:**
- Single Responsibility Principle
- Open/Closed Principle
- Proper abstraction
- Extensibility

**3. Problem-Solving Approach:**
```
1. Clarify requirements (5 minutes)
2. Identify core entities (5 minutes)
3. Define relationships (5 minutes)
4. Design classes and interfaces (10 minutes)
5. Implement core functionality (20 minutes)
6. Handle edge cases (5 minutes)
7. Discuss extensibility (5 minutes)
```

**4. Communication:**
- Explain your thought process
- Discuss trade-offs
- Ask clarifying questions
- Handle feedback gracefully

## Interview Format

**Typical 45-60 Minute Session:**
```
0-5 min: Problem statement
5-10 min: Clarifying questions
10-20 min: Class design (on whiteboard/editor)
20-45 min: Code implementation
45-55 min: Testing and edge cases
55-60 min: Extensibility discussion
```

**Common Problem Types:**
1. **Game Design** - Chess, Tic-Tac-Toe, Snake & Ladder
2. **Simulation Systems** - Parking lot, Elevator, Vending machine
3. **Business Logic** - Splitwise, Library management, Hotel booking
4. **Utility Systems** - Logger, Cache, Rate limiter

---

# 2. Object-Oriented Programming Fundamentals {#oop-fundamentals}

## 2.1 The Four Pillars of OOP

### 1. Abstraction - Hiding Complexity

**What It Means:**
Hide complex implementation details and expose only what's necessary.

**Real-World Analogy:**
```
You drive a car:
- You see: Steering wheel, pedals, gear shift
- You don't see: Engine internals, fuel injection system, transmission details

The car abstracts away complexity - you don't need to know how the engine works.
```

**Code Example - Bad (No Abstraction):**
```python
class EmailSender:
    def send_email(self, to, subject, body):
        # Client must know SMTP details
        import smtplib
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login('user@gmail.com', 'password')
        message = f"Subject: {subject}\n\n{body}"
        server.sendmail('user@gmail.com', to, message)
        server.quit()

# Client code knows too much
sender = EmailSender()
sender.send_email('client@example.com', 'Hello', 'Hi there')
```

**Code Example - Good (With Abstraction):**
```python
from abc import ABC, abstractmethod

class NotificationService(ABC):
    """Abstract interface - hides implementation"""
    
    @abstractmethod
    def send(self, recipient: str, message: str) -> bool:
        """Send notification to recipient"""
        pass

class EmailNotification(NotificationService):
    """Concrete implementation - details hidden"""
    
    def __init__(self, smtp_server: str, credentials: dict):
        self._smtp_server = smtp_server
        self._credentials = credentials
        self._connection = None
    
    def send(self, recipient: str, message: str) -> bool:
        """Client doesn't need to know SMTP details"""
        try:
            self._establish_connection()
            self._send_email(recipient, message)
            return True
        except Exception as e:
            return False
    
    def _establish_connection(self):
        """Private method - implementation detail"""
        # Complex SMTP logic hidden
        pass
    
    def _send_email(self, recipient: str, message: str):
        """Private method - implementation detail"""
        # Actual sending logic hidden
        pass

class SMSNotification(NotificationService):
    """Different implementation, same interface"""
    
    def send(self, recipient: str, message: str) -> bool:
        # SMS sending logic (completely different from email)
        # But client doesn't care - same interface
        return True

# Client code - simple and clean
def notify_user(notification: NotificationService, user: str, msg: str):
    """Works with any notification type"""
    notification.send(user, msg)

# Usage
email_service = EmailNotification('smtp.gmail.com', {'user': 'x', 'pass': 'y'})
sms_service = SMSNotification()

notify_user(email_service, 'user@example.com', 'Hello via email')
notify_user(sms_service, '+1234567890', 'Hello via SMS')
```

**Key Points:**
- Abstract base class defines **what** operations are available
- Concrete classes define **how** they're implemented
- Client code works with abstraction, not implementation
- Easy to add new notification types (Slack, Push, etc.) without changing client

**Interview Application - Payment Processing:**
```python
class PaymentProcessor(ABC):
    """Abstraction for payment processing"""
    
    @abstractmethod
    def process_payment(self, amount: float, card_details: dict) -> bool:
        pass
    
    @abstractmethod
    def refund(self, transaction_id: str, amount: float) -> bool:
        pass

class StripePaymentProcessor(PaymentProcessor):
    def process_payment(self, amount: float, card_details: dict) -> bool:
        # Stripe-specific API calls hidden
        # stripe.Charge.create(amount=amount, ...)
        return True
    
    def refund(self, transaction_id: str, amount: float) -> bool:
        # Stripe refund logic
        return True

class PayPalPaymentProcessor(PaymentProcessor):
    def process_payment(self, amount: float, card_details: dict) -> bool:
        # PayPal-specific API calls hidden
        return True
    
    def refund(self, transaction_id: str, amount: float) -> bool:
        # PayPal refund logic
        return True

class OrderService:
    """Order service doesn't know payment implementation details"""
    
    def __init__(self, payment_processor: PaymentProcessor):
        self.payment_processor = payment_processor
    
    def checkout(self, order: Order, card: dict):
        total = order.calculate_total()
        
        # Works with any payment processor
        if self.payment_processor.process_payment(total, card):
            order.status = "PAID"
            return True
        return False

# Easy to switch payment providers
order_service = OrderService(StripePaymentProcessor())
# OR
order_service = OrderService(PayPalPaymentProcessor())
```

**Benefits:**
- ✅ Client code doesn't break when payment provider changes
- ✅ Easy to test (mock PaymentProcessor)
- ✅ New payment providers just implement the interface
- ✅ Implementation details hidden

---

### 2. Encapsulation - Bundling Data and Methods

**What It Means:**
Bundle data (attributes) and methods (functions) that operate on that data within a single unit (class). Control access to internal data.

**Real-World Analogy:**
```
Bank Account:
- Data: balance, account_number (private - you can't directly change)
- Methods: deposit(), withdraw() (public - you can use these)
- You can't set balance = 1000000 directly
- You must use deposit(1000000) which has validation
```

**Code Example - Bad (No Encapsulation):**
```python
class BankAccount:
    def __init__(self):
        self.balance = 0  # Public - anyone can modify!
        self.account_number = "12345"

# Client can break invariants
account = BankAccount()
account.balance = 1000000  # Direct access - BAD!
account.balance = -500     # Negative balance - BAD!
account.account_number = "99999"  # Change account number - BAD!
```

**Code Example - Good (With Encapsulation):**
```python
class BankAccount:
    """Properly encapsulated bank account"""
    
    def __init__(self, account_number: str, initial_balance: float = 0):
        # Private attributes (name mangling with __)
        self.__account_number = account_number
        self.__balance = initial_balance
        self.__transaction_history = []
    
    @property
    def balance(self) -> float:
        """Read-only access to balance"""
        return self.__balance
    
    @property
    def account_number(self) -> str:
        """Read-only access to account number"""
        return self.__account_number
    
    def deposit(self, amount: float) -> bool:
        """Controlled way to modify balance"""
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        
        self.__balance += amount
        self.__transaction_history.append({
            'type': 'DEPOSIT',
            'amount': amount,
            'timestamp': datetime.now()
        })
        return True
    
    def withdraw(self, amount: float) -> bool:
        """Controlled way to modify balance with validation"""
        if amount <= 0:
            raise ValueError("Withdrawal amount must be positive")
        
        if amount > self.__balance:
            raise ValueError("Insufficient funds")
        
        self.__balance -= amount
        self.__transaction_history.append({
            'type': 'WITHDRAWAL',
            'amount': amount,
            'timestamp': datetime.now()
        })
        return True
    
    def get_statement(self) -> List[dict]:
        """Access transaction history (read-only copy)"""
        return self.__transaction_history.copy()

# Client code - safe and controlled
account = BankAccount("ACC-12345", 1000)

# ✅ Allowed operations
account.deposit(500)
account.withdraw(200)
print(account.balance)  # Read-only access

# ❌ Not allowed - encapsulation prevents these
# account.balance = 1000000  # AttributeError
# account.__balance = 5000   # Won't work (name mangling)
# account.__account_number = "99999"  # Won't work
```

**Interview Example - Shopping Cart:**
```python
class ShoppingCart:
    """Encapsulated shopping cart"""
    
    def __init__(self):
        self.__items = []  # Private - can't be modified directly
        self.__total = 0.0
    
    def add_item(self, product: Product, quantity: int):
        """Controlled way to add items"""
        if quantity <= 0:
            raise ValueError("Quantity must be positive")
        
        # Check inventory before adding
        if product.stock < quantity:
            raise ValueError("Insufficient stock")
        
        self.__items.append({
            'product': product,
            'quantity': quantity,
            'price_at_add': product.price
        })
        self.__recalculate_total()
    
    def remove_item(self, product_id: str):
        """Controlled way to remove items"""
        self.__items = [item for item in self.__items 
                        if item['product'].id != product_id]
        self.__recalculate_total()
    
    @property
    def total(self) -> float:
        """Read-only total"""
        return self.__total
    
    @property
    def item_count(self) -> int:
        """Read-only item count"""
        return sum(item['quantity'] for item in self.__items)
    
    def get_items(self) -> List[dict]:
        """Returns copy of items (not direct reference)"""
        return [item.copy() for item in self.__items]
    
    def __recalculate_total(self):
        """Private helper method"""
        self.__total = sum(
            item['price_at_add'] * item['quantity'] 
            for item in self.__items
        )

# Usage
cart = ShoppingCart()
cart.add_item(Product("BOOK-1", "Python Book", 29.99, stock=10), 2)

# ✅ Safe operations
print(cart.total)  # 59.98
print(cart.item_count)  # 2

# ❌ Cannot break cart state
# cart.__items = []  # Won't work
# cart.__total = 1000  # Won't work
```

**Benefits of Encapsulation:**
- ✅ Data integrity (validation in methods)
- ✅ Internal representation can change without breaking clients
- ✅ Easier debugging (changes only through defined methods)
- ✅ Security (sensitive data protected)

---

### 3. Inheritance - Code Reuse Through Hierarchy

**What It Means:**
A class can inherit properties and methods from another class, creating a parent-child relationship.

**Real-World Analogy:**
```
Vehicle (Parent)
├── properties: wheels, engine
├── methods: start(), stop()
│
├── Car (Child)
│   ├── inherits: wheels, engine, start(), stop()
│   ├── adds: trunk_capacity
│   └── overrides: start() (different ignition)
│
└── Motorcycle (Child)
    ├── inherits: wheels, engine, start(), stop()
    ├── adds: handlebar_type
    └── overrides: start() (kick start)
```

**Code Example - Basic Inheritance:**
```python
class Employee:
    """Base class - common properties for all employees"""
    
    def __init__(self, employee_id: str, name: str, base_salary: float):
        self.employee_id = employee_id
        self.name = name
        self.base_salary = base_salary
    
    def calculate_salary(self) -> float:
        """Default salary calculation"""
        return self.base_salary
    
    def get_details(self) -> str:
        """Common method for all employees"""
        return f"Employee: {self.name} (ID: {self.employee_id})"

class FullTimeEmployee(Employee):
    """Inherits from Employee, adds benefits"""
    
    def __init__(self, employee_id: str, name: str, base_salary: float, 
                 benefits: float):
        # Call parent constructor
        super().__init__(employee_id, name, base_salary)
        self.benefits = benefits
    
    def calculate_salary(self) -> float:
        """Override - add benefits to base salary"""
        return self.base_salary + self.benefits

class ContractEmployee(Employee):
    """Inherits from Employee, adds hourly rate"""
    
    def __init__(self, employee_id: str, name: str, hourly_rate: float):
        # Call parent with calculated base salary
        super().__init__(employee_id, name, 0)
        self.hourly_rate = hourly_rate
        self.hours_worked = 0
    
    def log_hours(self, hours: float):
        """Contract-specific method"""
        self.hours_worked += hours
    
    def calculate_salary(self) -> float:
        """Override - calculate based on hours"""
        return self.hourly_rate * self.hours_worked

# Usage
full_time = FullTimeEmployee("FT001", "Alice", 60000, 10000)
contract = ContractEmployee("CT001", "Bob", 50)

contract.log_hours(160)  # 160 hours worked

print(full_time.calculate_salary())  # 70000
print(contract.calculate_salary())   # 8000

# Both use inherited method
print(full_time.get_details())  # Employee: Alice (ID: FT001)
print(contract.get_details())   # Employee: Bob (ID: CT001)
```

**Interview Example - Shapes Hierarchy:**
```python
from abc import ABC, abstractmethod
import math

class Shape(ABC):
    """Abstract base class for all shapes"""
    
    def __init__(self, color: str):
        self.color = color
    
    @abstractmethod
    def area(self) -> float:
        """Each shape must implement area calculation"""
        pass
    
    @abstractmethod
    def perimeter(self) -> float:
        """Each shape must implement perimeter calculation"""
        pass
    
    def describe(self) -> str:
        """Common method for all shapes"""
        return f"{self.__class__.__name__} with color {self.color}"

class Rectangle(Shape):
    def __init__(self, color: str, width: float, height: float):
        super().__init__(color)
        self.width = width
        self.height = height
    
    def area(self) -> float:
        return self.width * self.height
    
    def perimeter(self) -> float:
        return 2 * (self.width + self.height)
    
    def is_square(self) -> bool:
        """Rectangle-specific method"""
        return self.width == self.height

class Circle(Shape):
    def __init__(self, color: str, radius: float):
        super().__init__(color)
        self.radius = radius
    
    def area(self) -> float:
        return math.pi * self.radius ** 2
    
    def perimeter(self) -> float:
        return 2 * math.pi * self.radius
    
    def diameter(self) -> float:
        """Circle-specific method"""
        return 2 * self.radius

class Triangle(Shape):
    def __init__(self, color: str, side1: float, side2: float, side3: float):
        super().__init__(color)
        self.side1 = side1
        self.side2 = side2
        self.side3 = side3
    
    def area(self) -> float:
        """Heron's formula"""
        s = self.perimeter() / 2
        return math.sqrt(s * (s - self.side1) * (s - self.side2) * (s - self.side3))
    
    def perimeter(self) -> float:
        return self.side1 + self.side2 + self.side3

# Polymorphic usage
def print_shape_info(shape: Shape):
    """Works with any shape - polymorphism!"""
    print(shape.describe())
    print(f"Area: {shape.area():.2f}")
    print(f"Perimeter: {shape.perimeter():.2f}")
    print()

# Usage
shapes = [
    Rectangle("red", 5, 10),
    Circle("blue", 7),
    Triangle("green", 3, 4, 5)
]

for shape in shapes:
    print_shape_info(shape)
```

**When to Use Inheritance:**
```
✅ Use when:
- "IS-A" relationship exists (Dog IS-A Animal)
- Shared behavior across related classes
- Need to extend base functionality

❌ Avoid when:
- "HAS-A" relationship (Car HAS-A Engine - use composition)
- No clear hierarchy
- Would create deep inheritance chains (>3 levels)
```

---

### 4. Polymorphism - Many Forms

**What It Means:**
Same interface, different implementations. Objects of different classes can be treated uniformly.

**Types of Polymorphism:**

**1. Method Overriding (Runtime Polymorphism):**
```python
class Animal:
    def make_sound(self):
        return "Some sound"

class Dog(Animal):
    def make_sound(self):
        return "Woof!"

class Cat(Animal):
    def make_sound(self):
        return "Meow!"

# Polymorphic behavior
def animal_concert(animals: List[Animal]):
    for animal in animals:
        print(animal.make_sound())  # Different sound for each

animals = [Dog(), Cat(), Dog()]
animal_concert(animals)
# Output:
# Woof!
# Meow!
# Woof!
```

**2. Method Overloading (Compile-time Polymorphism):**
```python
# Python doesn't have traditional overloading, but we can simulate it

class Calculator:
    def add(self, *args):
        """Polymorphic add - works with different number of arguments"""
        if len(args) == 2:
            return args[0] + args[1]
        elif len(args) == 3:
            return args[0] + args[1] + args[2]
        else:
            return sum(args)
    
    def multiply(self, a, b=None, c=None):
        """Different behavior based on arguments"""
        if c is not None:
            return a * b * c
        elif b is not None:
            return a * b
        else:
            return a

calc = Calculator()
print(calc.add(2, 3))        # 5
print(calc.add(2, 3, 4))     # 9
print(calc.add(1, 2, 3, 4))  # 10
```

**Interview Example - Payment Processing (Polymorphism in Action):**
```python
from abc import ABC, abstractmethod
from enum import Enum

class PaymentMethod(ABC):
    """Abstract base class for all payment methods"""
    
    @abstractmethod
    def validate(self) -> bool:
        """Validate payment method"""
        pass
    
    @abstractmethod
    def process_payment(self, amount: float) -> dict:
        """Process payment and return transaction details"""
        pass
    
    @abstractmethod
    def get_fee(self, amount: float) -> float:
        """Calculate processing fee"""
        pass

class CreditCardPayment(PaymentMethod):
    def __init__(self, card_number: str, cvv: str, expiry: str):
        self.card_number = card_number
        self.cvv = cvv
        self.expiry = expiry
    
    def validate(self) -> bool:
        # Credit card specific validation
        if len(self.card_number) != 16:
            return False
        if len(self.cvv) != 3:
            return False
        # Expiry date validation...
        return True
    
    def process_payment(self, amount: float) -> dict:
        if not self.validate():
            raise ValueError("Invalid credit card")
        
        # Credit card processing logic
        return {
            'status': 'SUCCESS',
            'transaction_id': 'CC-12345',
            'amount': amount,
            'fee': self.get_fee(amount)
        }
    
    def get_fee(self, amount: float) -> float:
        return amount * 0.029  # 2.9% fee

class PayPalPayment(PaymentMethod):
    def __init__(self, email: str):
        self.email = email
    
    def validate(self) -> bool:
        # Email validation
        return '@' in self.email
    
    def process_payment(self, amount: float) -> dict:
        if not self.validate():
            raise ValueError("Invalid PayPal account")
        
        # PayPal processing logic
        return {
            'status': 'SUCCESS',
            'transaction_id': 'PP-67890',
            'amount': amount,
            'fee': self.get_fee(amount)
        }
    
    def get_fee(self, amount: float) -> float:
        return amount * 0.034 + 0.30  # 3.4% + $0.30

class CryptocurrencyPayment(PaymentMethod):
    def __init__(self, wallet_address: str, currency: str):
        self.wallet_address = wallet_address
        self.currency = currency
    
    def validate(self) -> bool:
        # Wallet address validation
        return len(self.wallet_address) > 20
    
    def process_payment(self, amount: float) -> dict:
        if not self.validate():
            raise ValueError("Invalid wallet address")
        
        # Cryptocurrency processing logic
        return {
            'status': 'PENDING',  # Crypto takes time to confirm
            'transaction_id': 'CRYPTO-54321',
            'amount': amount,
            'fee': self.get_fee(amount)
        }
    
    def get_fee(self, amount: float) -> float:
        return 2.50  # Flat fee for crypto

class OrderProcessor:
    """Uses polymorphism - doesn't care about payment type"""
    
    def checkout(self, order_total: float, payment_method: PaymentMethod) -> dict:
        """Process order with any payment method"""
        
        # Polymorphic behavior - works with any PaymentMethod
        total_with_fee = order_total + payment_method.get_fee(order_total)
        
        print(f"Processing ${order_total:.2f} payment...")
        print(f"Fee: ${payment_method.get_fee(order_total):.2f}")
        print(f"Total: ${total_with_fee:.2f}")
        
        # Process payment - different implementation for each type
        result = payment_method.process_payment(total_with_fee)
        
        return result

# Usage - Polymorphism in action
processor = OrderProcessor()

# Same method, different payment types
payment1 = CreditCardPayment("1234567890123456", "123", "12/25")
payment2 = PayPalPayment("user@example.com")
payment3 = CryptocurrencyPayment("1A2b3C4d5E6f7G8h9I0j", "BTC")

# All work with the same checkout method!
result1 = processor.checkout(100.00, payment1)
result2 = processor.checkout(100.00, payment2)
result3 = processor.checkout(100.00, payment3)

print(result1)  # Different transaction ID, fee calculation
print(result2)  # Different transaction ID, fee calculation
print(result3)  # Different transaction ID, fee calculation
```

**Benefits of Polymorphism:**
```
✅ Write generic code that works with multiple types
✅ Easy to add new types without changing existing code
✅ Cleaner, more maintainable code
✅ Follows Open/Closed Principle
```

**Interview Tips:**
1. When designing systems, look for opportunities to use polymorphism
2. If you find yourself with lots of if-else or switch statements, consider polymorphism
3. Always think "What if we need to add a new type?" - polymorphism makes it easy

---

This is the beginning of the comprehensive LLD guide. I'll continue building out all sections with the same depth and detail. Should I continue with the SOLID principles section next?


## 2.2 Relationships Between Classes

Understanding relationships is crucial for LLD interviews.

### 1. Association - "Uses" Relationship

**Definition:** One class uses another class

**Example:**
```python
class Driver:
    def __init__(self, name: str, license_number: str):
        self.name = name
        self.license_number = license_number

class Car:
    def __init__(self, model: str, plate_number: str):
        self.model = model
        self.plate_number = plate_number

# Association: Driver drives Car (temporary relationship)
def drive_car(driver: Driver, car: Car):
    print(f"{driver.name} is driving {car.model}")

driver = Driver("John", "DL12345")
car = Car("Tesla Model 3", "ABC123")
drive_car(driver, car)  # Association happens at runtime
```

### 2. Aggregation - "Has-A" (Weak Ownership)

**Definition:** Container can exist without contained object. Contained object can exist independently.

**Example - Department and Employee:**
```python
class Employee:
    def __init__(self, name: str):
        self.name = name

class Department:
    """Department HAS employees, but employees can exist without department"""
    
    def __init__(self, name: str):
        self.name = name
        self.employees = []  # Aggregation
    
    def add_employee(self, employee: Employee):
        self.employees.append(employee)
    
    def remove_employee(self, employee: Employee):
        self.employees.remove(employee)

# Employees exist independently
emp1 = Employee("Alice")
emp2 = Employee("Bob")

# Department contains employees
dept = Department("Engineering")
dept.add_employee(emp1)
dept.add_employee(emp2)

# Department deleted, employees still exist
del dept
print(emp1.name)  # Still works
```

### 3. Composition - "Has-A" (Strong Ownership)

**Definition:** Container owns contained objects. Contained objects can't exist without container.

**Example - Car and Engine:**
```python
class Engine:
    """Engine can't exist without Car"""
    
    def __init__(self, horsepower: int):
        self.horsepower = horsepower
    
    def start(self):
        print(f"Engine started: {self.horsepower} HP")

class Car:
    """Car owns Engine (composition)"""
    
    def __init__(self, model: str, horsepower: int):
        self.model = model
        # Engine is created within Car - strong ownership
        self.engine = Engine(horsepower)
    
    def start(self):
        print(f"Starting {self.model}")
        self.engine.start()

# Car creates and owns engine
car = Car("BMW", 300)
car.start()

# If car is deleted, engine is also deleted
del car
# engine.start()  # Would error - engine doesn't exist independently
```

**Interview Tip - When to Use Which:**
```
Use Aggregation when:
- Objects can exist independently
- Example: University HAS Students (students exist without university)

Use Composition when:
- Object lifecycle is tied to container
- Example: House HAS Rooms (rooms don't exist without house)
```

---

# 3. SOLID Principles - The Foundation {#solid-principles}

SOLID principles are the most important concepts for LLD interviews. Interviewers expect you to apply these.

## 3.1 Single Responsibility Principle (SRP)

**Definition:** A class should have only ONE reason to change.

**Bad Example - Multiple Responsibilities:**
```python
class User:
    """❌ BAD: This class has too many responsibilities"""
    
    def __init__(self, username: str, email: str):
        self.username = username
        self.email = email
    
    # Responsibility 1: User data management
    def update_email(self, new_email: str):
        self.email = new_email
    
    # Responsibility 2: Database operations
    def save_to_database(self):
        # Database logic
        db.execute(f"INSERT INTO users VALUES ('{self.username}', '{self.email}')")
    
    # Responsibility 3: Email sending
    def send_welcome_email(self):
        # Email sending logic
        smtp.send(self.email, "Welcome!", "Thanks for joining!")
    
    # Responsibility 4: Logging
    def log_activity(self, activity: str):
        with open('user_logs.txt', 'a') as f:
            f.write(f"{self.username}: {activity}\n")

# Problems:
# - If database schema changes, User class must change
# - If email server changes, User class must change
# - If logging format changes, User class must change
# - Hard to test
# - Violates SRP
```

**Good Example - Single Responsibility:**
```python
class User:
    """✅ GOOD: Only handles user data"""
    
    def __init__(self, username: str, email: str):
        self.username = username
        self.email = email
    
    def update_email(self, new_email: str):
        """Only user data management"""
        if self._validate_email(new_email):
            self.email = new_email
            return True
        return False
    
    def _validate_email(self, email: str) -> bool:
        return '@' in email

class UserRepository:
    """✅ GOOD: Only handles database operations"""
    
    def save(self, user: User):
        db.execute(
            "INSERT INTO users (username, email) VALUES (?, ?)",
            (user.username, user.email)
        )
    
    def find_by_username(self, username: str) -> User:
        result = db.query("SELECT * FROM users WHERE username = ?", (username,))
        return User(result['username'], result['email'])
    
    def update(self, user: User):
        db.execute(
            "UPDATE users SET email = ? WHERE username = ?",
            (user.email, user.username)
        )

class EmailService:
    """✅ GOOD: Only handles email operations"""
    
    def send_welcome_email(self, user: User):
        subject = "Welcome!"
        body = f"Hi {user.username}, thanks for joining!"
        self._send_email(user.email, subject, body)
    
    def send_password_reset(self, user: User, reset_link: str):
        subject = "Password Reset"
        body = f"Click here to reset: {reset_link}"
        self._send_email(user.email, subject, body)
    
    def _send_email(self, to: str, subject: str, body: str):
        smtp.send(to, subject, body)

class UserLogger:
    """✅ GOOD: Only handles logging"""
    
    def log_registration(self, user: User):
        self._log(f"User registered: {user.username}")
    
    def log_login(self, user: User):
        self._log(f"User logged in: {user.username}")
    
    def _log(self, message: str):
        timestamp = datetime.now().isoformat()
        with open('user_logs.txt', 'a') as f:
            f.write(f"[{timestamp}] {message}\n")

# Usage - Coordinated by a service
class UserService:
    """Coordinates the separate responsibilities"""
    
    def __init__(self):
        self.repository = UserRepository()
        self.email_service = EmailService()
        self.logger = UserLogger()
    
    def register_user(self, username: str, email: str):
        # Create user
        user = User(username, email)
        
        # Save to database
        self.repository.save(user)
        
        # Send welcome email
        self.email_service.send_welcome_email(user)
        
        # Log the activity
        self.logger.log_registration(user)
        
        return user

# Benefits:
# - User class changes only when user data structure changes
# - Email logic changes don't affect User or Repository
# - Easy to test each class independently
# - Easy to replace implementations (e.g., different database)
```

**Interview Application - Order Processing:**
```python
# ❌ BAD - Violates SRP
class Order:
    def calculate_total(self): pass
    def save_to_database(self): pass
    def send_confirmation_email(self): pass
    def print_invoice(self): pass
    def update_inventory(self): pass

# ✅ GOOD - Follows SRP
class Order:
    """Only order data and business logic"""
    def calculate_total(self): pass

class OrderRepository:
    """Only database operations"""
    def save(self, order: Order): pass

class OrderNotificationService:
    """Only notifications"""
    def send_confirmation(self, order: Order): pass

class InvoiceGenerator:
    """Only invoice generation"""
    def generate_pdf(self, order: Order): pass

class InventoryService:
    """Only inventory management"""
    def reserve_items(self, order: Order): pass
```

---

## 3.2 Open/Closed Principle (OCP)

**Definition:** Classes should be OPEN for extension but CLOSED for modification.

**What It Means:** You should be able to add new functionality without changing existing code.

**Bad Example - Not Open/Closed:**
```python
class DiscountCalculator:
    """❌ BAD: Must modify class to add new discount types"""
    
    def calculate_discount(self, order_type: str, amount: float) -> float:
        if order_type == "REGULAR":
            return 0
        elif order_type == "PREMIUM":
            return amount * 0.10
        elif order_type == "VIP":
            return amount * 0.20
        elif order_type == "BLACK_FRIDAY":  # ❌ Adding this requires modifying class
            return amount * 0.50
        # What if we add CYBER_MONDAY? Modify again!
        # What if we add STUDENT? Modify again!
        # This violates OCP
```

**Good Example - Open/Closed:**
```python
from abc import ABC, abstractmethod

class DiscountStrategy(ABC):
    """✅ GOOD: Base class for all discount strategies"""
    
    @abstractmethod
    def calculate_discount(self, amount: float) -> float:
        pass

class NoDiscount(DiscountStrategy):
    """Regular customers - no discount"""
    
    def calculate_discount(self, amount: float) -> float:
        return 0

class PremiumDiscount(DiscountStrategy):
    """Premium customers - 10% discount"""
    
    def calculate_discount(self, amount: float) -> float:
        return amount * 0.10

class VIPDiscount(DiscountStrategy):
    """VIP customers - 20% discount"""
    
    def calculate_discount(self, amount: float) -> float:
        return amount * 0.20

class BlackFridayDiscount(DiscountStrategy):
    """Black Friday - 50% discount"""
    
    def calculate_discount(self, amount: float) -> float:
        return amount * 0.50

# ✅ Can add new discount types without modifying existing code!
class StudentDiscount(DiscountStrategy):
    """Student discount - 15% off"""
    
    def calculate_discount(self, amount: float) -> float:
        return amount * 0.15

class Order:
    """Order class doesn't need to change when new discounts are added"""
    
    def __init__(self, amount: float, discount_strategy: DiscountStrategy):
        self.amount = amount
        self.discount_strategy = discount_strategy
    
    def get_total(self) -> float:
        discount = self.discount_strategy.calculate_discount(self.amount)
        return self.amount - discount

# Usage
order1 = Order(100, PremiumDiscount())
print(order1.get_total())  # 90

order2 = Order(100, BlackFridayDiscount())
print(order2.get_total())  # 50

# Adding new discount type doesn't require changing Order or existing discount classes!
order3 = Order(100, StudentDiscount())
print(order3.get_total())  # 85
```

**Interview Example - Payment Processing (Real-World OCP):**
```python
class PaymentProcessor(ABC):
    """✅ OPEN for extension"""
    
    @abstractmethod
    def process(self, amount: float) -> bool:
        pass

class CreditCardProcessor(PaymentProcessor):
    def process(self, amount: float) -> bool:
        # Credit card processing
        return True

class PayPalProcessor(PaymentProcessor):
    def process(self, amount: float) -> bool:
        # PayPal processing
        return True

# ✅ EXTENSION: Add new payment method without modifying existing code
class CryptocurrencyProcessor(PaymentProcessor):
    def process(self, amount: float) -> bool:
        # Crypto processing
        return True

# ✅ EXTENSION: Add another payment method
class ApplePayProcessor(PaymentProcessor):
    def process(self, amount: float) -> bool:
        # Apple Pay processing
        return True

class CheckoutService:
    """✅ CLOSED for modification - doesn't change when new payment types added"""
    
    def checkout(self, amount: float, processor: PaymentProcessor) -> bool:
        return processor.process(amount)

# Usage
checkout = CheckoutService()
checkout.checkout(100, CreditCardProcessor())
checkout.checkout(100, CryptocurrencyProcessor())  # New processor, no code changes!
```

**Key Insight:**
```
When you see yourself writing:
if type == "A": do_something()
elif type == "B": do_something_else()
elif type == "C": do_another_thing()

Think: "This violates OCP. Use polymorphism instead!"
```

---

## 3.3 Liskov Substitution Principle (LSP)

**Definition:** Objects of a superclass should be replaceable with objects of a subclass without breaking the application.

**What It Means:** If class B inherits from class A, you should be able to use B anywhere you use A, and everything should work correctly.

**Bad Example - Violates LSP:**
```python
class Rectangle:
    """❌ Square violates LSP when inheriting from Rectangle"""
    
    def __init__(self, width: int, height: int):
        self.width = width
        self.height = height
    
    def set_width(self, width: int):
        self.width = width
    
    def set_height(self, height: int):
        self.height = height
    
    def get_area(self) -> int:
        return self.width * self.height

class Square(Rectangle):
    """❌ Violates LSP - changes behavior of Rectangle"""
    
    def set_width(self, width: int):
        # Square must have equal width and height
        self.width = width
        self.height = width  # ❌ Unexpected behavior!
    
    def set_height(self, height: int):
        # Square must have equal width and height
        self.width = height  # ❌ Unexpected behavior!
        self.height = height

# LSP Violation demonstration
def test_rectangle(rect: Rectangle):
    """Function expects Rectangle behavior"""
    rect.set_width(5)
    rect.set_height(4)
    assert rect.get_area() == 20, "Area should be 20"

rectangle = Rectangle(0, 0)
test_rectangle(rectangle)  # ✅ Works fine

square = Square(0, 0)
test_rectangle(square)  # ❌ FAILS! Area is 16, not 20
# Square doesn't behave like Rectangle - LSP violated
```

**Good Example - Follows LSP:**
```python
from abc import ABC, abstractmethod

class Shape(ABC):
    """✅ GOOD: Common base class"""
    
    @abstractmethod
    def get_area(self) -> float:
        pass

class Rectangle(Shape):
    """✅ Rectangle with independent width and height"""
    
    def __init__(self, width: float, height: float):
        self.width = width
        self.height = height
    
    def get_area(self) -> float:
        return self.width * self.height

class Square(Shape):
    """✅ Square with only side length"""
    
    def __init__(self, side: float):
        self.side = side
    
    def get_area(self) -> float:
        return self.side * self.side

# Both can be used interchangeably through Shape interface
def print_area(shape: Shape):
    """✅ Works with any Shape"""
    print(f"Area: {shape.get_area()}")

rectangle = Rectangle(5, 4)
square = Square(5)

print_area(rectangle)  # ✅ Works
print_area(square)     # ✅ Works
```

**Interview Example - Bird Hierarchy (Classic LSP Example):**
```python
# ❌ BAD - Violates LSP
class Bird:
    def fly(self):
        print("Flying in the sky")

class Penguin(Bird):
    def fly(self):
        raise Exception("Penguins can't fly!")  # ❌ Violates LSP!

# Code expects all Birds to fly
def make_bird_fly(bird: Bird):
    bird.fly()

sparrow = Bird()
make_bird_fly(sparrow)  # ✅ Works

penguin = Penguin()
make_bird_fly(penguin)  # ❌ Crashes! Penguin can't be substituted for Bird
```

**✅ GOOD - Follows LSP:**
```python
from abc import ABC, abstractmethod

class Bird(ABC):
    """Base class for all birds"""
    
    @abstractmethod
    def move(self):
        pass

class FlyingBird(Bird):
    """Only flying birds inherit from this"""
    
    def move(self):
        self.fly()
    
    def fly(self):
        print("Flying in the sky")

class FlightlessBird(Bird):
    """Non-flying birds inherit from this"""
    
    def move(self):
        self.walk()
    
    def walk(self):
        print("Walking on ground")

class Sparrow(FlyingBird):
    pass

class Penguin(FlightlessBird):
    def swim(self):
        print("Swimming in water")

# ✅ LSP satisfied - all birds can move
def make_bird_move(bird: Bird):
    bird.move()

sparrow = Sparrow()
penguin = Penguin()

make_bird_move(sparrow)  # ✅ Works - flies
make_bird_move(penguin)  # ✅ Works - walks
```

**LSP Checklist:**
```
✅ Subclass should not strengthen preconditions
✅ Subclass should not weaken postconditions
✅ Subclass should not throw new exceptions (unless documented)
✅ Subclass behavior should match expectations set by superclass
```

---

## 3.4 Interface Segregation Principle (ISP)

**Definition:** Clients should not be forced to depend on interfaces they don't use.

**What It Means:** Better to have many small, specific interfaces than one large, general-purpose interface.

**Bad Example - Fat Interface:**
```python
class Worker(ABC):
    """❌ BAD: Fat interface - not all workers do all these things"""
    
    @abstractmethod
    def work(self):
        pass
    
    @abstractmethod
    def eat(self):
        pass
    
    @abstractmethod
    def sleep(self):
        pass
    
    @abstractmethod
    def get_paid(self):
        pass

class HumanWorker(Worker):
    """✅ Implements all methods - fine"""
    
    def work(self):
        print("Working...")
    
    def eat(self):
        print("Eating lunch...")
    
    def sleep(self):
        print("Sleeping...")
    
    def get_paid(self):
        print("Receiving salary...")

class RobotWorker(Worker):
    """❌ Forced to implement methods it doesn't need"""
    
    def work(self):
        print("Working 24/7...")
    
    def eat(self):
        # ❌ Robots don't eat!
        raise NotImplementedError("Robots don't eat")
    
    def sleep(self):
        # ❌ Robots don't sleep!
        raise NotImplementedError("Robots don't sleep")
    
    def get_paid(self):
        # ❌ Robots don't get paid!
        raise NotImplementedError("Robots don't get paid")

# Code breaks when using Robot as Worker
def lunch_break(worker: Worker):
    worker.eat()  # ❌ Crashes if worker is Robot

robot = RobotWorker()
lunch_break(robot)  # ❌ Exception!
```

**Good Example - Segregated Interfaces:**
```python
class Workable(ABC):
    """✅ Small, focused interface"""
    
    @abstractmethod
    def work(self):
        pass

class Eatable(ABC):
    """✅ Separate interface for eating"""
    
    @abstractmethod
    def eat(self):
        pass

class Sleepable(ABC):
    """✅ Separate interface for sleeping"""
    
    @abstractmethod
    def sleep(self):
        pass

class Payable(ABC):
    """✅ Separate interface for payment"""
    
    @abstractmethod
    def get_paid(self):
        pass

class HumanWorker(Workable, Eatable, Sleepable, Payable):
    """✅ Implements only what it needs"""
    
    def work(self):
        print("Working...")
    
    def eat(self):
        print("Eating lunch...")
    
    def sleep(self):
        print("Sleeping...")
    
    def get_paid(self):
        print("Receiving salary...")

class RobotWorker(Workable):
    """✅ Only implements what makes sense"""
    
    def work(self):
        print("Working 24/7...")

# ✅ Code now works correctly
def manage_workable(worker: Workable):
    """Works with any Workable"""
    worker.work()

def lunch_break(worker: Eatable):
    """Only works with workers that can eat"""
    worker.eat()

robot = RobotWorker()
human = HumanWorker()

manage_workable(robot)  # ✅ Works
manage_workable(human)  # ✅ Works

lunch_break(human)  # ✅ Works
# lunch_break(robot)  # ✅ Won't compile - Robot doesn't implement Eatable
```

**Interview Example - Multi-Function Printer:**
```python
# ❌ BAD - Violates ISP
class MultiFunctionDevice(ABC):
    """Fat interface"""
    
    @abstractmethod
    def print(self, document):
        pass
    
    @abstractmethod
    def scan(self, document):
        pass
    
    @abstractmethod
    def fax(self, document):
        pass

class SimplePrinter(MultiFunctionDevice):
    """❌ Forced to implement scan and fax even though it can't"""
    
    def print(self, document):
        print(f"Printing: {document}")
    
    def scan(self, document):
        raise NotImplementedError("This printer can't scan")
    
    def fax(self, document):
        raise NotImplementedError("This printer can't fax")

# ✅ GOOD - Follows ISP
class Printer(ABC):
    @abstractmethod
    def print(self, document):
        pass

class Scanner(ABC):
    @abstractmethod
    def scan(self, document):
        pass

class Fax(ABC):
    @abstractmethod
    def fax(self, document):
        pass

class SimplePrinter(Printer):
    """✅ Only implements what it can do"""
    
    def print(self, document):
        print(f"Printing: {document}")

class AllInOnePrinter(Printer, Scanner, Fax):
    """✅ Implements all interfaces it supports"""
    
    def print(self, document):
        print(f"Printing: {document}")
    
    def scan(self, document):
        print(f"Scanning: {document}")
    
    def fax(self, document):
        print(f"Faxing: {document}")

# Usage
def print_document(printer: Printer, doc):
    """Works with any Printer"""
    printer.print(doc)

simple = SimplePrinter()
all_in_one = AllInOnePrinter()

print_document(simple, "Report.pdf")      # ✅ Works
print_document(all_in_one, "Report.pdf")  # ✅ Works
```

---

## 3.5 Dependency Inversion Principle (DIP)

**Definition:** 
- High-level modules should not depend on low-level modules. Both should depend on abstractions.
- Abstractions should not depend on details. Details should depend on abstractions.

**What It Means:** Depend on interfaces/abstractions, not concrete implementations.

**Bad Example - Tight Coupling:**
```python
class MySQLDatabase:
    """❌ Concrete implementation"""
    
    def connect(self):
        print("Connecting to MySQL...")
    
    def save(self, data):
        print(f"Saving to MySQL: {data}")

class UserService:
    """❌ Depends on concrete MySQL implementation"""
    
    def __init__(self):
        self.database = MySQLDatabase()  # ❌ Tight coupling!
    
    def save_user(self, user):
        self.database.save(user)

# Problems:
# - Can't switch to PostgreSQL without changing UserService
# - Can't test UserService without MySQL
# - Violates DIP
```

**Good Example - Dependency Inversion:**
```python
from abc import ABC, abstractmethod

class Database(ABC):
    """✅ Abstraction - high-level concept"""
    
    @abstractmethod
    def connect(self):
        pass
    
    @abstractmethod
    def save(self, data):
        pass

class MySQLDatabase(Database):
    """✅ Concrete implementation depends on abstraction"""
    
    def connect(self):
        print("Connecting to MySQL...")
    
    def save(self, data):
        print(f"Saving to MySQL: {data}")

class PostgreSQLDatabase(Database):
    """✅ Another implementation of same abstraction"""
    
    def connect(self):
        print("Connecting to PostgreSQL...")
    
    def save(self, data):
        print(f"Saving to PostgreSQL: {data}")

class MongoDatabase(Database):
    """✅ Yet another implementation"""
    
    def connect(self):
        print("Connecting to MongoDB...")
    
    def save(self, data):
        print(f"Saving to MongoDB: {data}")

class UserService:
    """✅ Depends on abstraction, not concrete implementation"""
    
    def __init__(self, database: Database):
        self.database = database  # ✅ Dependency injection!
    
    def save_user(self, user):
        self.database.save(user)

# Usage - Easy to switch databases
mysql_db = MySQLDatabase()
postgres_db = PostgreSQLDatabase()
mongo_db = MongoDatabase()

service1 = UserService(mysql_db)      # Uses MySQL
service2 = UserService(postgres_db)   # Uses PostgreSQL
service3 = UserService(mongo_db)      # Uses MongoDB

# All work the same way!
service1.save_user({"name": "Alice"})
service2.save_user({"name": "Bob"})
service3.save_user({"name": "Charlie"})

# ✅ Easy to test with mock database
class MockDatabase(Database):
    def connect(self):
        pass
    
    def save(self, data):
        print(f"Mock save: {data}")

test_service = UserService(MockDatabase())
test_service.save_user({"name": "Test"})  # ✅ Easy to test!
```

**Interview Example - Notification System:**
```python
# ❌ BAD - Violates DIP
class EmailSender:
    def send(self, message):
        print(f"Email: {message}")

class NotificationService:
    """❌ Depends on concrete EmailSender"""
    
    def __init__(self):
        self.sender = EmailSender()  # ❌ Tight coupling
    
    def notify(self, user, message):
        self.sender.send(message)

# Can't switch to SMS without changing NotificationService!

# ✅ GOOD - Follows DIP
class MessageSender(ABC):
    """✅ Abstraction"""
    
    @abstractmethod
    def send(self, recipient, message):
        pass

class EmailSender(MessageSender):
    """✅ Concrete implementation"""
    
    def send(self, recipient, message):
        print(f"Email to {recipient}: {message}")

class SMSSender(MessageSender):
    """✅ Another implementation"""
    
    def send(self, recipient, message):
        print(f"SMS to {recipient}: {message}")

class PushNotificationSender(MessageSender):
    """✅ Yet another implementation"""
    
    def send(self, recipient, message):
        print(f"Push to {recipient}: {message}")

class NotificationService:
    """✅ Depends on abstraction"""
    
    def __init__(self, sender: MessageSender):
        self.sender = sender  # ✅ Dependency injection
    
    def notify(self, user, message):
        self.sender.send(user, message)

# ✅ Easy to switch notification methods
email_service = NotificationService(EmailSender())
sms_service = NotificationService(SMSSender())
push_service = NotificationService(PushNotificationSender())

email_service.notify("user@example.com", "Welcome!")
sms_service.notify("+1234567890", "Your OTP: 123456")
push_service.notify("device_token_123", "New message!")
```

**DIP Benefits:**
```
✅ Loose coupling - easy to change implementations
✅ Easy to test - inject mock dependencies
✅ Easy to extend - add new implementations without changing existing code
✅ More maintainable - changes in one class don't affect others
```

**Interview Tip:**
When you see `__init__` creating objects directly:
```python
class Service:
    def __init__(self):
        self.dependency = ConcreteDependency()  # ❌ Violates DIP
```

Think: "Use dependency injection instead!"
```python
class Service:
    def __init__(self, dependency: AbstractDependency):
        self.dependency = dependency  # ✅ Follows DIP
```

---

This completes the SOLID principles section with comprehensive examples! Should I continue with Design Patterns next?


# 4. Design Patterns - Creational {#creational-patterns}

Creational patterns deal with object creation mechanisms, trying to create objects in a manner suitable to the situation.

## 4.1 Singleton Pattern - One Instance to Rule Them All

**When to Use:** When you need exactly ONE instance of a class in your entire application.

**Real-World Examples:**
- Database connection pool
- Logger
- Configuration manager
- Cache manager

**Problem Without Singleton:**
```python
# ❌ Multiple instances created
class DatabaseConnection:
    def __init__(self):
        print("Creating expensive database connection...")
        # Connect to database (expensive operation)

# Multiple connections created!
conn1 = DatabaseConnection()  # Creates connection
conn2 = DatabaseConnection()  # Creates ANOTHER connection
conn3 = DatabaseConnection()  # Creates YET ANOTHER connection

# Wastes resources!
```

**Singleton Implementation - Thread-Safe:**
```python
import threading

class DatabaseConnection:
    """✅ Singleton - only one instance exists"""
    
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:  # Thread-safe
                if cls._instance is None:  # Double-checked locking
                    print("Creating singleton database connection...")
                    cls._instance = super().__new__(cls)
                    cls._instance._initialize()
        return cls._instance
    
    def _initialize(self):
        """Initialize the instance (called only once)"""
        self.connection_string = "postgresql://localhost:5432/mydb"
        self.is_connected = False
    
    def connect(self):
        if not self.is_connected:
            print(f"Connecting to {self.connection_string}")
            self.is_connected = True
    
    def query(self, sql):
        if not self.is_connected:
            self.connect()
        print(f"Executing: {sql}")

# Usage
conn1 = DatabaseConnection()
conn2 = DatabaseConnection()
conn3 = DatabaseConnection()

print(conn1 is conn2)  # True - same instance
print(conn2 is conn3)  # True - same instance

# Only creates connection once
conn1.query("SELECT * FROM users")
conn2.query("SELECT * FROM products")  # Uses same connection
```

**Interview Example - Logger Singleton:**
```python
from datetime import datetime
from typing import Optional

class Logger:
    """Singleton logger - only one instance for entire application"""
    
    _instance: Optional['Logger'] = None
    _lock = threading.Lock()
    
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if not self._initialized:
            self.log_file = "app.log"
            self.log_level = "INFO"
            self._initialized = True
    
    def log(self, level: str, message: str):
        timestamp = datetime.now().isoformat()
        log_entry = f"[{timestamp}] [{level}] {message}"
        
        with open(self.log_file, 'a') as f:
            f.write(log_entry + '\n')
        
        print(log_entry)
    
    def info(self, message: str):
        self.log("INFO", message)
    
    def error(self, message: str):
        self.log("ERROR", message)
    
    def warning(self, message: str):
        self.log("WARNING", message)

# Usage across application
class UserService:
    def __init__(self):
        self.logger = Logger()  # Gets singleton instance
    
    def create_user(self, username):
        self.logger.info(f"Creating user: {username}")

class OrderService:
    def __init__(self):
        self.logger = Logger()  # Same instance as UserService!
    
    def process_order(self, order_id):
        self.logger.info(f"Processing order: {order_id}")

# Both services use the same logger
user_service = UserService()
order_service = OrderService()

user_service.create_user("alice")
order_service.process_order(12345)

# Verify it's the same instance
print(user_service.logger is order_service.logger)  # True
```

**When NOT to Use Singleton:**
```
❌ When you need multiple configurations
❌ When state needs to be independent
❌ When it makes testing difficult
✅ Use dependency injection instead in these cases
```

---

## 4.2 Factory Pattern - Object Creation Delegation

**When to Use:** When you need to create objects without specifying the exact class.

**Problem - Direct Instantiation:**
```python
# ❌ Client code knows about all concrete classes
def create_notification(channel: str):
    if channel == "email":
        return EmailNotification()
    elif channel == "sms":
        return SMSNotification()
    elif channel == "push":
        return PushNotification()
    # Adding new notification type requires changing this code!
```

**Factory Pattern Solution:**
```python
from abc import ABC, abstractmethod

class Notification(ABC):
    """Product interface"""
    
    @abstractmethod
    def send(self, recipient: str, message: str):
        pass

class EmailNotification(Notification):
    """Concrete product"""
    
    def send(self, recipient: str, message: str):
        print(f"Email to {recipient}: {message}")

class SMSNotification(Notification):
    """Concrete product"""
    
    def send(self, recipient: str, message: str):
        print(f"SMS to {recipient}: {message}")

class PushNotification(Notification):
    """Concrete product"""
    
    def send(self, recipient: str, message: str):
        print(f"Push to {recipient}: {message}")

class NotificationFactory:
    """✅ Factory - encapsulates object creation"""
    
    @staticmethod
    def create_notification(channel: str) -> Notification:
        """Factory method"""
        if channel == "email":
            return EmailNotification()
        elif channel == "sms":
            return SMSNotification()
        elif channel == "push":
            return PushNotification()
        else:
            raise ValueError(f"Unknown channel: {channel}")

# Client code - doesn't know about concrete classes
def notify_user(channel: str, recipient: str, message: str):
    """Client code uses factory"""
    notification = NotificationFactory.create_notification(channel)
    notification.send(recipient, message)

# Usage
notify_user("email", "user@example.com", "Welcome!")
notify_user("sms", "+1234567890", "Your OTP: 123456")
notify_user("push", "device_123", "New message")
```

**Abstract Factory Pattern - Family of Related Objects:**
```python
class UIFactory(ABC):
    """Abstract factory - creates family of related objects"""
    
    @abstractmethod
    def create_button(self):
        pass
    
    @abstractmethod
    def create_checkbox(self):
        pass

class WindowsFactory(UIFactory):
    """Concrete factory for Windows UI"""
    
    def create_button(self):
        return WindowsButton()
    
    def create_checkbox(self):
        return WindowsCheckbox()

class MacFactory(UIFactory):
    """Concrete factory for Mac UI"""
    
    def create_button(self):
        return MacButton()
    
    def create_checkbox(self):
        return MacCheckbox()

class Application:
    """Client uses abstract factory"""
    
    def __init__(self, factory: UIFactory):
        self.factory = factory
    
    def create_ui(self):
        button = self.factory.create_button()
        checkbox = self.factory.create_checkbox()
        button.render()
        checkbox.render()

# Usage - easy to switch UI themes
windows_app = Application(WindowsFactory())
mac_app = Application(MacFactory())

windows_app.create_ui()  # Creates Windows-style UI
mac_app.create_ui()      # Creates Mac-style UI
```

**Interview Example - Payment Processing:**
```python
class PaymentProcessor(ABC):
    @abstractmethod
    def process(self, amount: float) -> dict:
        pass

class StripeProcessor(PaymentProcessor):
    def process(self, amount: float) -> dict:
        print(f"Processing ${amount} via Stripe")
        return {'status': 'success', 'gateway': 'stripe'}

class PayPalProcessor(PaymentProcessor):
    def process(self, amount: float) -> dict:
        print(f"Processing ${amount} via PayPal")
        return {'status': 'success', 'gateway': 'paypal'}

class BraintreeProcessor(PaymentProcessor):
    def process(self, amount: float) -> dict:
        print(f"Processing ${amount} via Braintree")
        return {'status': 'success', 'gateway': 'braintree'}

class PaymentFactory:
    """Factory for payment processors"""
    
    _processors = {
        'stripe': StripeProcessor,
        'paypal': PayPalProcessor,
        'braintree': BraintreeProcessor
    }
    
    @classmethod
    def create_processor(cls, gateway: str) -> PaymentProcessor:
        processor_class = cls._processors.get(gateway)
        if not processor_class:
            raise ValueError(f"Unknown gateway: {gateway}")
        return processor_class()
    
    @classmethod
    def register_processor(cls, name: str, processor_class):
        """✅ Can add new processors at runtime!"""
        cls._processors[name] = processor_class

# Usage
processor = PaymentFactory.create_processor('stripe')
processor.process(100.00)

# ✅ Easy to add new processor
class SquareProcessor(PaymentProcessor):
    def process(self, amount: float) -> dict:
        return {'status': 'success', 'gateway': 'square'}

PaymentFactory.register_processor('square', SquareProcessor)
processor = PaymentFactory.create_processor('square')
```

---

## 4.3 Builder Pattern - Complex Object Construction

**When to Use:** When you need to create complex objects step by step.

**Problem - Constructor Hell:**
```python
# ❌ BAD - Too many parameters
class Pizza:
    def __init__(self, size, cheese, pepperoni, mushrooms, olives, 
                 bacon, onions, bell_peppers, extra_cheese, stuffed_crust,
                 gluten_free, vegan_cheese):
        # 12 parameters! Hard to remember order!
        pass

# Usage is confusing
pizza = Pizza("large", True, True, False, True, False, True, False, False, True, False, False)
# What does this even mean?
```

**Builder Pattern Solution:**
```python
class Pizza:
    """Product being built"""
    
    def __init__(self):
        self.size = None
        self.cheese = False
        self.toppings = []
        self.crust = "regular"
    
    def __str__(self):
        return f"{self.size} pizza with {self.crust} crust, " \
               f"cheese={self.cheese}, toppings={self.toppings}"

class PizzaBuilder:
    """✅ Builder - constructs Pizza step by step"""
    
    def __init__(self):
        self.pizza = Pizza()
    
    def set_size(self, size: str):
        """Fluent interface - returns self"""
        self.pizza.size = size
        return self
    
    def add_cheese(self):
        self.pizza.cheese = True
        return self
    
    def add_topping(self, topping: str):
        self.pizza.toppings.append(topping)
        return self
    
    def set_crust(self, crust: str):
        self.pizza.crust = crust
        return self
    
    def build(self) -> Pizza:
        """Return the constructed product"""
        return self.pizza

# ✅ Usage - much clearer!
pizza = (PizzaBuilder()
    .set_size("large")
    .add_cheese()
    .add_topping("pepperoni")
    .add_topping("mushrooms")
    .add_topping("olives")
    .set_crust("stuffed")
    .build())

print(pizza)  # large pizza with stuffed crust, cheese=True, 
              # toppings=['pepperoni', 'mushrooms', 'olives']

# Another pizza - different configuration
veggie_pizza = (PizzaBuilder()
    .set_size("medium")
    .add_cheese()
    .add_topping("mushrooms")
    .add_topping("bell peppers")
    .add_topping("onions")
    .build())
```

**Interview Example - HTTP Request Builder:**
```python
class HTTPRequest:
    """Complex object to build"""
    
    def __init__(self):
        self.method = "GET"
        self.url = None
        self.headers = {}
        self.query_params = {}
        self.body = None
        self.timeout = 30
    
    def __str__(self):
        return f"{self.method} {self.url} Headers: {self.headers}"

class HTTPRequestBuilder:
    """✅ Builder for HTTP requests"""
    
    def __init__(self, url: str):
        self.request = HTTPRequest()
        self.request.url = url
    
    def method(self, method: str):
        self.request.method = method.upper()
        return self
    
    def header(self, key: str, value: str):
        self.request.headers[key] = value
        return self
    
    def query(self, key: str, value: str):
        self.request.query_params[key] = value
        return self
    
    def body(self, data):
        self.request.body = data
        return self
    
    def timeout(self, seconds: int):
        self.request.timeout = seconds
        return self
    
    def build(self) -> HTTPRequest:
        return self.request

# Usage - very readable!
request = (HTTPRequestBuilder("https://api.example.com/users")
    .method("POST")
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer token123")
    .query("page", "1")
    .query("limit", "10")
    .body({"name": "Alice", "email": "alice@example.com"})
    .timeout(60)
    .build())

print(request)
```

**Builder with Director (Full Pattern):**
```python
class Car:
    """Product"""
    def __init__(self):
        self.engine = None
        self.wheels = None
        self.seats = None
        self.color = None

class CarBuilder(ABC):
    """Abstract builder"""
    
    @abstractmethod
    def build_engine(self):
        pass
    
    @abstractmethod
    def build_wheels(self):
        pass
    
    @abstractmethod
    def build_seats(self):
        pass
    
    @abstractmethod
    def paint(self):
        pass
    
    @abstractmethod
    def get_car(self) -> Car:
        pass

class SportsCarBuilder(CarBuilder):
    """Concrete builder for sports car"""
    
    def __init__(self):
        self.car = Car()
    
    def build_engine(self):
        self.car.engine = "V8 Engine"
        return self
    
    def build_wheels(self):
        self.car.wheels = "Sport Wheels"
        return self
    
    def build_seats(self):
        self.car.seats = "2 Bucket Seats"
        return self
    
    def paint(self):
        self.car.color = "Red"
        return self
    
    def get_car(self) -> Car:
        return self.car

class SUVBuilder(CarBuilder):
    """Concrete builder for SUV"""
    
    def __init__(self):
        self.car = Car()
    
    def build_engine(self):
        self.car.engine = "V6 Engine"
        return self
    
    def build_wheels(self):
        self.car.wheels = "All-Terrain Wheels"
        return self
    
    def build_seats(self):
        self.car.seats = "7 Seats"
        return self
    
    def paint(self):
        self.car.color = "Black"
        return self
    
    def get_car(self) -> Car:
        return self.car

class CarDirector:
    """Director - knows the steps to build a car"""
    
    def __init__(self, builder: CarBuilder):
        self.builder = builder
    
    def construct(self) -> Car:
        """Build a car with all steps"""
        return (self.builder
            .build_engine()
            .build_wheels()
            .build_seats()
            .paint()
            .get_car())

# Usage
sports_builder = SportsCarBuilder()
director = CarDirector(sports_builder)
sports_car = director.construct()

print(f"Sports car: {sports_car.engine}, {sports_car.color}")

suv_builder = SUVBuilder()
director = CarDirector(suv_builder)
suv = director.construct()

print(f"SUV: {suv.engine}, {suv.color}")
```

**When to Use Builder:**
```
✅ Use when:
- Object has many optional parameters
- Construction is complex with multiple steps
- Want immutable objects
- Want readable construction code

❌ Don't use when:
- Object is simple (few parameters)
- Construction is straightforward
```

---


# 5. Design Patterns - Structural {#structural-patterns}

Structural patterns deal with object composition and relationships between entities.

## 5.1 Adapter Pattern - Making Incompatible Interfaces Work Together

**When to Use:** When you need to use a class with an incompatible interface.

**Real-World Analogy:** Using a power adapter to plug a US device into a European socket.

**Problem - Incompatible Interfaces:**
```python
class OldPaymentGateway:
    """Old system we already use"""
    
    def make_payment(self, amount):
        print(f"Processing ${amount} via old gateway")
        return {"success": True, "transaction_id": "OLD-123"}

class NewPaymentGateway:
    """New system with different interface"""
    
    def process_transaction(self, payment_data):
        print(f"Processing ${payment_data['amount']} via new gateway")
        return {"status": "SUCCESS", "txn_id": "NEW-456"}

# Our application expects this interface
class PaymentProcessor(ABC):
    @abstractmethod
    def pay(self, amount: float) -> dict:
        pass

# Problem: How to use NewPaymentGateway with our existing interface?
```

**Adapter Pattern Solution:**
```python
class OldPaymentAdapter(PaymentProcessor):
    """✅ Adapter for old gateway"""
    
    def __init__(self):
        self.old_gateway = OldPaymentGateway()
    
    def pay(self, amount: float) -> dict:
        """Adapts old interface to new interface"""
        result = self.old_gateway.make_payment(amount)
        # Transform response to match expected format
        return {
            "success": result["success"],
            "transaction_id": result["transaction_id"]
        }

class NewPaymentAdapter(PaymentProcessor):
    """✅ Adapter for new gateway"""
    
    def __init__(self):
        self.new_gateway = NewPaymentGateway()
    
    def pay(self, amount: float) -> dict:
        """Adapts new interface to our interface"""
        payment_data = {"amount": amount}
        result = self.new_gateway.process_transaction(payment_data)
        # Transform response to match expected format
        return {
            "success": result["status"] == "SUCCESS",
            "transaction_id": result["txn_id"]
        }

# Client code doesn't change!
class OrderService:
    def __init__(self, payment_processor: PaymentProcessor):
        self.payment_processor = payment_processor
    
    def checkout(self, amount: float):
        result = self.payment_processor.pay(amount)
        if result["success"]:
            print(f"Payment successful: {result['transaction_id']}")

# Usage - same client code works with both gateways
service1 = OrderService(OldPaymentAdapter())
service1.checkout(100)

service2 = OrderService(NewPaymentAdapter())
service2.checkout(200)
```

**Interview Example - Third-Party API Integration:**
```python
class StripeAPI:
    """Third-party library we don't control"""
    
    def charge(self, card_token, cents):
        """Stripe uses cents, not dollars"""
        print(f"Stripe charging {cents} cents")
        return {"id": "ch_123", "status": "succeeded"}

class PayPalAPI:
    """Another third-party with different interface"""
    
    def create_payment(self, payer_info, transaction):
        print(f"PayPal charging ${transaction['amount']}")
        return {"paymentID": "PAY-456", "state": "approved"}

# Our application's payment interface
class Payment(ABC):
    @abstractmethod
    def process(self, amount_dollars: float, card_details: dict) -> bool:
        pass

class StripeAdapter(Payment):
    """✅ Adapter for Stripe"""
    
    def __init__(self):
        self.stripe = StripeAPI()
    
    def process(self, amount_dollars: float, card_details: dict) -> bool:
        # Convert dollars to cents
        cents = int(amount_dollars * 100)
        card_token = self._create_token(card_details)
        
        result = self.stripe.charge(card_token, cents)
        return result["status"] == "succeeded"
    
    def _create_token(self, card_details: dict) -> str:
        return "tok_123"

class PayPalAdapter(Payment):
    """✅ Adapter for PayPal"""
    
    def __init__(self):
        self.paypal = PayPalAPI()
    
    def process(self, amount_dollars: float, card_details: dict) -> bool:
        payer_info = {"email": card_details.get("email")}
        transaction = {"amount": amount_dollars, "currency": "USD"}
        
        result = self.paypal.create_payment(payer_info, transaction)
        return result["state"] == "approved"

# Client code is clean and consistent
class CheckoutService:
    def __init__(self, payment: Payment):
        self.payment = payment
    
    def process_order(self, amount: float, card: dict):
        if self.payment.process(amount, card):
            print("Order processed successfully")
        else:
            print("Payment failed")

# Same code works with different providers
stripe_checkout = CheckoutService(StripeAdapter())
paypal_checkout = CheckoutService(PayPalAdapter())

stripe_checkout.process_order(99.99, {"number": "4242..."})
paypal_checkout.process_order(149.99, {"email": "user@example.com"})
```

---

## 5.2 Decorator Pattern - Adding Responsibilities Dynamically

**When to Use:** When you need to add functionality to objects without modifying their structure.

**Real-World Analogy:** Adding toppings to pizza - each topping decorates the base pizza.

**Problem - Class Explosion:**
```python
# ❌ Need separate class for every combination
class Coffee: pass
class CoffeeWithMilk: pass
class CoffeeWithSugar: pass
class CoffeeWithMilkAndSugar: pass
class CoffeeWithMilkAndSugarAndVanilla: pass
# 2^n classes for n toppings!
```

**Decorator Pattern Solution:**
```python
class Beverage(ABC):
    """Component interface"""
    
    @abstractmethod
    def get_description(self) -> str:
        pass
    
    @abstractmethod
    def get_cost(self) -> float:
        pass

class Coffee(Beverage):
    """Concrete component"""
    
    def get_description(self) -> str:
        return "Coffee"
    
    def get_cost(self) -> float:
        return 2.0

class Espresso(Beverage):
    """Another concrete component"""
    
    def get_description(self) -> str:
        return "Espresso"
    
    def get_cost(self) -> float:
        return 2.5

class BeverageDecorator(Beverage):
    """Base decorator"""
    
    def __init__(self, beverage: Beverage):
        self._beverage = beverage
    
    def get_description(self) -> str:
        return self._beverage.get_description()
    
    def get_cost(self) -> float:
        return self._beverage.get_cost()

class Milk(BeverageDecorator):
    """Concrete decorator"""
    
    def get_description(self) -> str:
        return self._beverage.get_description() + ", Milk"
    
    def get_cost(self) -> float:
        return self._beverage.get_cost() + 0.5

class Sugar(BeverageDecorator):
    """Concrete decorator"""
    
    def get_description(self) -> str:
        return self._beverage.get_description() + ", Sugar"
    
    def get_cost(self) -> float:
        return self._beverage.get_cost() + 0.2

class Vanilla(BeverageDecorator):
    """Concrete decorator"""
    
    def get_description(self) -> str:
        return self._beverage.get_description() + ", Vanilla"
    
    def get_cost(self) -> float:
        return self._beverage.get_cost() + 0.7

# ✅ Usage - wrap decorators dynamically
beverage = Coffee()
print(f"{beverage.get_description()}: ${beverage.get_cost()}")
# Coffee: $2.0

beverage = Milk(Coffee())
print(f"{beverage.get_description()}: ${beverage.get_cost()}")
# Coffee, Milk: $2.5

beverage = Vanilla(Sugar(Milk(Coffee())))
print(f"{beverage.get_description()}: ${beverage.get_cost()}")
# Coffee, Milk, Sugar, Vanilla: $3.4

# Different combinations without new classes!
beverage = Sugar(Sugar(Espresso()))  # Double sugar espresso
print(f"{beverage.get_description()}: ${beverage.get_cost()}")
# Espresso, Sugar, Sugar: $2.9
```

**Interview Example - Text Formatting:**
```python
class Text(ABC):
    """Component interface"""
    
    @abstractmethod
    def render(self) -> str:
        pass

class PlainText(Text):
    """Concrete component"""
    
    def __init__(self, content: str):
        self.content = content
    
    def render(self) -> str:
        return self.content

class TextDecorator(Text):
    """Base decorator"""
    
    def __init__(self, text: Text):
        self._text = text
    
    def render(self) -> str:
        return self._text.render()

class BoldDecorator(TextDecorator):
    """Makes text bold"""
    
    def render(self) -> str:
        return f"<b>{self._text.render()}</b>"

class ItalicDecorator(TextDecorator):
    """Makes text italic"""
    
    def render(self) -> str:
        return f"<i>{self._text.render()}</i>"

class UnderlineDecorator(TextDecorator):
    """Underlines text"""
    
    def render(self) -> str:
        return f"<u>{self._text.render()}</u>"

class ColorDecorator(TextDecorator):
    """Adds color to text"""
    
    def __init__(self, text: Text, color: str):
        super().__init__(text)
        self.color = color
    
    def render(self) -> str:
        return f'<span style="color:{self.color}">{self._text.render()}</span>'

# Usage - combine formatting dynamically
text = PlainText("Hello World")
print(text.render())  # Hello World

formatted = BoldDecorator(text)
print(formatted.render())  # <b>Hello World</b>

formatted = ItalicDecorator(BoldDecorator(text))
print(formatted.render())  # <i><b>Hello World</b></i>

formatted = ColorDecorator(
    UnderlineDecorator(
        ItalicDecorator(
            BoldDecorator(text)
        )
    ),
    "red"
)
print(formatted.render())
# <span style="color:red"><u><i><b>Hello World</b></i></u></span>
```

**Real-World Example - Logger with Features:**
```python
class Logger(ABC):
    @abstractmethod
    def log(self, message: str):
        pass

class SimpleLogger(Logger):
    """Basic logger"""
    
    def log(self, message: str):
        print(message)

class LoggerDecorator(Logger):
    """Base decorator"""
    
    def __init__(self, logger: Logger):
        self._logger = logger
    
    def log(self, message: str):
        self._logger.log(message)

class TimestampDecorator(LoggerDecorator):
    """Adds timestamp"""
    
    def log(self, message: str):
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self._logger.log(f"[{timestamp}] {message}")

class LevelDecorator(LoggerDecorator):
    """Adds log level"""
    
    def __init__(self, logger: Logger, level: str):
        super().__init__(logger)
        self.level = level
    
    def log(self, message: str):
        self._logger.log(f"[{self.level}] {message}")

class FileDecorator(LoggerDecorator):
    """Writes to file"""
    
    def __init__(self, logger: Logger, filename: str):
        super().__init__(logger)
        self.filename = filename
    
    def log(self, message: str):
        self._logger.log(message)
        with open(self.filename, 'a') as f:
            f.write(message + '\n')

class EncryptionDecorator(LoggerDecorator):
    """Encrypts sensitive logs"""
    
    def log(self, message: str):
        encrypted = self._encrypt(message)
        self._logger.log(f"ENCRYPTED: {encrypted}")
    
    def _encrypt(self, message: str) -> str:
        # Simple encryption for demo
        return message[::-1]  # Reverse string

# Build logger with multiple features
logger = SimpleLogger()

# Add timestamp
logger = TimestampDecorator(logger)

# Add log level
logger = LevelDecorator(logger, "INFO")

# Add file logging
logger = FileDecorator(logger, "app.log")

# For sensitive data, add encryption
sensitive_logger = EncryptionDecorator(
    LevelDecorator(
        TimestampDecorator(
            SimpleLogger()
        ),
        "SECRET"
    )
)

logger.log("User logged in")
# [INFO] [2024-11-30 10:30:00] User logged in

sensitive_logger.log("Password: secret123")
# ENCRYPTED: [SECRET] [2024-11-30 10:30:00] 321terces :drowssaP
```

---

## 5.3 Proxy Pattern - Controlling Access to Objects

**When to Use:** When you need a placeholder or surrogate to control access to another object.

**Types of Proxies:**
1. **Virtual Proxy** - Lazy initialization
2. **Protection Proxy** - Access control
3. **Remote Proxy** - Represents object in different address space
4. **Caching Proxy** - Cache results

**Virtual Proxy Example - Lazy Loading:**
```python
class Image(ABC):
    """Subject interface"""
    
    @abstractmethod
    def display(self):
        pass

class RealImage(Image):
    """Real subject - expensive to create"""
    
    def __init__(self, filename: str):
        self.filename = filename
        self._load_from_disk()
    
    def _load_from_disk(self):
        print(f"Loading image from disk: {self.filename}")
        # Expensive operation - loading large image file
        time.sleep(2)  # Simulate loading time
    
    def display(self):
        print(f"Displaying image: {self.filename}")

class ImageProxy(Image):
    """✅ Proxy - delays creation until needed"""
    
    def __init__(self, filename: str):
        self.filename = filename
        self._real_image = None  # Not created yet!
    
    def display(self):
        # Lazy initialization - create only when needed
        if self._real_image is None:
            self._real_image = RealImage(self.filename)
        self._real_image.display()

# Usage
print("Creating image proxy...")
image = ImageProxy("large_photo.jpg")  # Fast! Doesn't load image yet
print("Image proxy created")

print("\nFirst display (triggers loading)...")
image.display()  # Now it loads

print("\nSecond display (already loaded)...")
image.display()  # Instant! Already in memory

# Output:
# Creating image proxy...
# Image proxy created
#
# First display (triggers loading)...
# Loading image from disk: large_photo.jpg  # 2 second delay
# Displaying image: large_photo.jpg
#
# Second display (already loaded)...
# Displaying image: large_photo.jpg  # Instant
```

**Protection Proxy Example - Access Control:**
```python
class Document(ABC):
    @abstractmethod
    def read(self) -> str:
        pass
    
    @abstractmethod
    def write(self, content: str):
        pass

class SecretDocument(Document):
    """Real document"""
    
    def __init__(self, content: str):
        self._content = content
    
    def read(self) -> str:
        return self._content
    
    def write(self, content: str):
        self._content = content

class ProtectedDocumentProxy(Document):
    """✅ Protection proxy - controls access"""
    
    def __init__(self, document: Document, user_role: str):
        self._document = document
        self._user_role = user_role
    
    def read(self) -> str:
        # Everyone can read
        return self._document.read()
    
    def write(self, content: str):
        # Only admins can write
        if self._user_role != "admin":
            raise PermissionError("Only admins can write to this document")
        self._document.write(content)

# Usage
doc = SecretDocument("Confidential information")

# Regular user
user_proxy = ProtectedDocumentProxy(doc, "user")
print(user_proxy.read())  # ✅ Works
try:
    user_proxy.write("New content")  # ❌ Raises PermissionError
except PermissionError as e:
    print(f"Error: {e}")

# Admin user
admin_proxy = ProtectedDocumentProxy(doc, "admin")
print(admin_proxy.read())  # ✅ Works
admin_proxy.write("Updated content")  # ✅ Works
```

**Caching Proxy Example - API Calls:**
```python
class DataService(ABC):
    """Subject interface"""
    
    @abstractmethod
    def get_data(self, key: str) -> dict:
        pass

class RealDataService(DataService):
    """Real service - makes expensive API calls"""
    
    def get_data(self, key: str) -> dict:
        print(f"Fetching data from API for key: {key}")
        time.sleep(1)  # Simulate network delay
        return {"key": key, "value": f"data_for_{key}"}

class CachingProxyService(DataService):
    """✅ Caching proxy - stores results"""
    
    def __init__(self, real_service: DataService):
        self._real_service = real_service
        self._cache = {}
    
    def get_data(self, key: str) -> dict:
        # Check cache first
        if key in self._cache:
            print(f"Returning cached data for key: {key}")
            return self._cache[key]
        
        # Cache miss - call real service
        data = self._real_service.get_data(key)
        self._cache[key] = data
        return data

# Usage
real_service = RealDataService()
proxy = CachingProxyService(real_service)

# First call - hits API
data1 = proxy.get_data("user_123")
# Output: Fetching data from API for key: user_123

# Second call - returns from cache
data2 = proxy.get_data("user_123")
# Output: Returning cached data for key: user_123

# Different key - hits API again
data3 = proxy.get_data("user_456")
# Output: Fetching data from API for key: user_456
```

**Interview Example - Database Connection Proxy:**
```python
class Database(ABC):
    @abstractmethod
    def query(self, sql: str) -> list:
        pass

class RealDatabase(Database):
    """Actual database connection"""
    
    def __init__(self):
        print("Establishing database connection...")
        time.sleep(1)  # Connection overhead
    
    def query(self, sql: str) -> list:
        print(f"Executing query: {sql}")
        return [{"id": 1, "name": "Alice"}]

class DatabaseProxy(Database):
    """
    ✅ Combines multiple proxy types:
    - Virtual proxy (lazy initialization)
    - Protection proxy (SQL injection check)
    - Caching proxy (cache query results)
    """
    
    def __init__(self):
        self._database = None
        self._cache = {}
    
    def query(self, sql: str) -> list:
        # Protection: Check for SQL injection
        if self._is_malicious(sql):
            raise SecurityError("Potential SQL injection detected")
        
        # Caching: Return cached result if available
        if sql in self._cache:
            print(f"Returning cached result")
            return self._cache[sql]
        
        # Virtual proxy: Create connection only when needed
        if self._database is None:
            self._database = RealDatabase()
        
        # Execute query and cache result
        result = self._database.query(sql)
        self._cache[sql] = result
        return result
    
    def _is_malicious(self, sql: str) -> bool:
        malicious_patterns = ["DROP TABLE", "DELETE FROM", "--", "';"]
        return any(pattern in sql.upper() for pattern in malicious_patterns)

# Usage
db_proxy = DatabaseProxy()
print("Proxy created (no connection yet)")

# First query - creates connection and caches
result1 = db_proxy.query("SELECT * FROM users")

# Same query - returns from cache
result2 = db_proxy.query("SELECT * FROM users")

# Malicious query - blocked
try:
    db_proxy.query("SELECT * FROM users; DROP TABLE users;")
except SecurityError as e:
    print(f"Blocked: {e}")
```

---

## 5.4 Facade Pattern - Simplified Interface to Complex System

**When to Use:** When you need a simple interface to a complex subsystem.

**Problem - Complex Subsystem:**
```python
# ❌ Client must understand and interact with many classes
class CPU:
    def freeze(self): pass
    def jump(self, position): pass
    def execute(self): pass

class Memory:
    def load(self, position, data): pass

class HardDrive:
    def read(self, lba, size): pass

# Client code is complex
cpu = CPU()
memory = Memory()
hd = HardDrive()

# Many steps to boot computer
cpu.freeze()
memory.load(0, hd.read(0, 1024))
cpu.jump(0)
cpu.execute()
# Too complex for clients!
```

**Facade Pattern Solution:**
```python
class ComputerFacade:
    """✅ Facade - simple interface to complex system"""
    
    def __init__(self):
        self.cpu = CPU()
        self.memory = Memory()
        self.hard_drive = HardDrive()
    
    def start(self):
        """One simple method instead of many complex steps"""
        print("Starting computer...")
        self.cpu.freeze()
        self.memory.load(0, self.hard_drive.read(0, 1024))
        self.cpu.jump(0)
        self.cpu.execute()
        print("Computer started!")

# ✅ Client code is simple
computer = ComputerFacade()
computer.start()  # That's it!
```

**Interview Example - Order Processing System:**
```python
# Complex subsystems
class InventorySystem:
    def check_availability(self, product_id: str, quantity: int) -> bool:
        print(f"Checking inventory for {product_id}...")
        return True
    
    def reserve_items(self, product_id: str, quantity: int):
        print(f"Reserving {quantity} units of {product_id}")

class PaymentSystem:
    def validate_card(self, card_number: str) -> bool:
        print(f"Validating card {card_number}...")
        return True
    
    def charge(self, amount: float, card_number: str) -> str:
        print(f"Charging ${amount} to card {card_number}")
        return "txn_12345"

class ShippingSystem:
    def calculate_shipping(self, address: dict) -> float:
        print(f"Calculating shipping to {address['city']}...")
        return 9.99
    
    def create_shipment(self, order_id: str, address: dict) -> str:
        print(f"Creating shipment for order {order_id}")
        return "ship_67890"

class NotificationSystem:
    def send_confirmation(self, email: str, order_id: str):
        print(f"Sending confirmation to {email} for order {order_id}")

class OrderFacade:
    """✅ Facade - simplifies order processing"""
    
    def __init__(self):
        self.inventory = InventorySystem()
        self.payment = PaymentSystem()
        self.shipping = ShippingSystem()
        self.notification = NotificationSystem()
    
    def place_order(self, product_id: str, quantity: int, 
                    card_number: str, address: dict, email: str) -> dict:
        """One simple method orchestrates complex process"""
        
        # Step 1: Check inventory
        if not self.inventory.check_availability(product_id, quantity):
            return {"success": False, "error": "Out of stock"}
        
        # Step 2: Validate payment
        if not self.payment.validate_card(card_number):
            return {"success": False, "error": "Invalid card"}
        
        # Step 3: Calculate costs
        item_price = 29.99 * quantity
        shipping_cost = self.shipping.calculate_shipping(address)
        total = item_price + shipping_cost
        
        # Step 4: Process payment
        txn_id = self.payment.charge(total, card_number)
        
        # Step 5: Reserve inventory
        self.inventory.reserve_items(product_id, quantity)
        
        # Step 6: Create shipment
        order_id = f"ORD-{txn_id}"
        ship_id = self.shipping.create_shipment(order_id, address)
        
        # Step 7: Send notification
        self.notification.send_confirmation(email, order_id)
        
        return {
            "success": True,
            "order_id": order_id,
            "transaction_id": txn_id,
            "shipping_id": ship_id
        }

# ✅ Client code is extremely simple
order_facade = OrderFacade()

result = order_facade.place_order(
    product_id="BOOK-123",
    quantity=2,
    card_number="4242424242424242",
    address={"street": "123 Main St", "city": "New York"},
    email="customer@example.com"
)

print(result)
```

---

## 5.5 Composite Pattern - Tree Structures

**When to Use:** When you need to represent part-whole hierarchies as tree structures.

**Interview Example - File System:**
```python
class FileSystemComponent(ABC):
    """Component interface"""
    
    @abstractmethod
    def get_size(self) -> int:
        pass
    
    @abstractmethod
    def display(self, indent: int = 0):
        pass

class File(FileSystemComponent):
    """Leaf - individual file"""
    
    def __init__(self, name: str, size: int):
        self.name = name
        self.size = size
    
    def get_size(self) -> int:
        return self.size
    
    def display(self, indent: int = 0):
        print("  " * indent + f"📄 {self.name} ({self.size} bytes)")

class Directory(FileSystemComponent):
    """Composite - can contain files and directories"""
    
    def __init__(self, name: str):
        self.name = name
        self.children = []
    
    def add(self, component: FileSystemComponent):
        self.children.append(component)
    
    def remove(self, component: FileSystemComponent):
        self.children.remove(component)
    
    def get_size(self) -> int:
        """Size is sum of all children"""
        return sum(child.get_size() for child in self.children)
    
    def display(self, indent: int = 0):
        print("  " * indent + f"📁 {self.name}/ ({self.get_size()} bytes)")
        for child in self.children:
            child.display(indent + 1)

# Build file system tree
root = Directory("root")

# Documents folder
docs = Directory("Documents")
docs.add(File("resume.pdf", 1024))
docs.add(File("cover_letter.docx", 2048))

# Pictures folder
pics = Directory("Pictures")
pics.add(File("vacation.jpg", 4096))
pics.add(File("family.png", 3072))

# Nested folder
work = Directory("Work")
work.add(File("presentation.pptx", 8192))
docs.add(work)  # Work is inside Documents

# Add to root
root.add(docs)
root.add(pics)
root.add(File("readme.txt", 512))

# Display entire tree
root.display()

# Output:
# 📁 root/ (19456 bytes)
#   📁 Documents/ (11776 bytes)
#     📄 resume.pdf (1024 bytes)
#     📄 cover_letter.docx (2048 bytes)
#     📁 Work/ (8192 bytes)
#       📄 presentation.pptx (8192 bytes)
#   📁 Pictures/ (7168 bytes)
#     📄 vacation.jpg (4096 bytes)
#     📄 family.png (3072 bytes)
#   📄 readme.txt (512 bytes)

print(f"\nTotal size: {root.get_size()} bytes")
```

---


# 6. Design Patterns - Behavioral {#behavioral-patterns}

Behavioral patterns focus on communication between objects and how responsibilities are distributed.

## 6.1 Strategy Pattern - Interchangeable Algorithms

**When to Use:** When you have multiple algorithms for a task and want to choose at runtime.

**Problem - If-Else Hell:**
```python
# ❌ BAD - violates Open/Closed Principle
class Navigator:
    def calculate_route(self, start, end, mode):
        if mode == "car":
            # Car routing algorithm
            return "Route by car"
        elif mode == "bike":
            # Bike routing algorithm
            return "Route by bike"
        elif mode == "walk":
            # Walking algorithm
            return "Route on foot"
        # Adding new mode requires modifying this class!
```

**Strategy Pattern Solution:**
```python
class RouteStrategy(ABC):
    """Strategy interface"""
    
    @abstractmethod
    def calculate_route(self, start: str, end: str) -> str:
        pass

class CarStrategy(RouteStrategy):
    """Concrete strategy for car"""
    
    def calculate_route(self, start: str, end: str) -> str:
        return f"Car route from {start} to {end} via highways"

class BikeStrategy(RouteStrategy):
    """Concrete strategy for bike"""
    
    def calculate_route(self, start: str, end: str) -> str:
        return f"Bike route from {start} to {end} via bike lanes"

class WalkStrategy(RouteStrategy):
    """Concrete strategy for walking"""
    
    def calculate_route(self, start: str, end: str) -> str:
        return f"Walking route from {start} to {end} via sidewalks"

class PublicTransportStrategy(RouteStrategy):
    """✅ New strategy - no modification to existing code!"""
    
    def calculate_route(self, start: str, end: str) -> str:
        return f"Public transport from {start} to {end} via bus/train"

class Navigator:
    """Context - uses strategy"""
    
    def __init__(self, strategy: RouteStrategy):
        self._strategy = strategy
    
    def set_strategy(self, strategy: RouteStrategy):
        """Can change strategy at runtime"""
        self._strategy = strategy
    
    def build_route(self, start: str, end: str) -> str:
        return self._strategy.calculate_route(start, end)

# Usage
navigator = Navigator(CarStrategy())
print(navigator.build_route("Home", "Work"))
# Car route from Home to Work via highways

# Change strategy at runtime
navigator.set_strategy(BikeStrategy())
print(navigator.build_route("Home", "Work"))
# Bike route from Home to Work via bike lanes

navigator.set_strategy(PublicTransportStrategy())
print(navigator.build_route("Home", "Work"))
# Public transport from Home to Work via bus/train
```

**Interview Example - Payment Methods:**
```python
class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, amount: float) -> bool:
        pass

class CreditCardStrategy(PaymentStrategy):
    def __init__(self, card_number: str, cvv: str):
        self.card_number = card_number
        self.cvv = cvv
    
    def pay(self, amount: float) -> bool:
        print(f"Paying ${amount} with credit card {self.card_number[-4:]}")
        # Credit card processing logic
        return True

class PayPalStrategy(PaymentStrategy):
    def __init__(self, email: str):
        self.email = email
    
    def pay(self, amount: float) -> bool:
        print(f"Paying ${amount} via PayPal ({self.email})")
        # PayPal processing logic
        return True

class CryptoStrategy(PaymentStrategy):
    def __init__(self, wallet_address: str):
        self.wallet_address = wallet_address
    
    def pay(self, amount: float) -> bool:
        print(f"Paying ${amount} via cryptocurrency")
        # Crypto processing logic
        return True

class ShoppingCart:
    def __init__(self):
        self.items = []
        self.payment_strategy = None
    
    def add_item(self, item: str, price: float):
        self.items.append({"item": item, "price": price})
    
    def set_payment_method(self, strategy: PaymentStrategy):
        self.payment_strategy = strategy
    
    def checkout(self) -> bool:
        if not self.payment_strategy:
            raise ValueError("No payment method selected")
        
        total = sum(item["price"] for item in self.items)
        return self.payment_strategy.pay(total)

# Usage
cart = ShoppingCart()
cart.add_item("Laptop", 999.99)
cart.add_item("Mouse", 29.99)

# User chooses payment method
cart.set_payment_method(CreditCardStrategy("4242424242424242", "123"))
cart.checkout()

# Can change payment method
cart.set_payment_method(PayPalStrategy("user@example.com"))
cart.checkout()
```

---

## 6.2 Observer Pattern - Event Notification

**When to Use:** When changes to one object should notify multiple dependent objects.

**Real-World Example:** Newsletter subscription - when new article published, all subscribers notified.

**Implementation:**
```python
class Subject(ABC):
    """Subject being observed"""
    
    def __init__(self):
        self._observers = []
    
    def attach(self, observer: 'Observer'):
        """Subscribe observer"""
        self._observers.append(observer)
    
    def detach(self, observer: 'Observer'):
        """Unsubscribe observer"""
        self._observers.remove(observer)
    
    def notify(self, event: dict):
        """Notify all observers"""
        for observer in self._observers:
            observer.update(event)

class Observer(ABC):
    """Observer interface"""
    
    @abstractmethod
    def update(self, event: dict):
        pass

class Stock(Subject):
    """Concrete subject - stock price"""
    
    def __init__(self, symbol: str, price: float):
        super().__init__()
        self.symbol = symbol
        self._price = price
    
    @property
    def price(self) -> float:
        return self._price
    
    @price.setter
    def price(self, new_price: float):
        """When price changes, notify observers"""
        old_price = self._price
        self._price = new_price
        
        self.notify({
            "symbol": self.symbol,
            "old_price": old_price,
            "new_price": new_price,
            "change": new_price - old_price
        })

class EmailAlert(Observer):
    """Concrete observer - sends email on price change"""
    
    def __init__(self, email: str):
        self.email = email
    
    def update(self, event: dict):
        change = event["change"]
        direction = "increased" if change > 0 else "decreased"
        print(f"Email to {self.email}: {event['symbol']} {direction} "
              f"from ${event['old_price']} to ${event['new_price']}")

class SMSAlert(Observer):
    """Concrete observer - sends SMS"""
    
    def __init__(self, phone: str):
        self.phone = phone
    
    def update(self, event: dict):
        if abs(event["change"]) > 5:  # Only alert on big changes
            print(f"SMS to {phone}: {event['symbol']} changed by ${event['change']}")

class Dashboard(Observer):
    """Concrete observer - updates dashboard"""
    
    def update(self, event: dict):
        print(f"Dashboard: Updating {event['symbol']} to ${event['new_price']}")

# Usage
tesla_stock = Stock("TSLA", 250.00)

# Observers subscribe
email_alert = EmailAlert("investor@example.com")
sms_alert = SMSAlert("+1234567890")
dashboard = Dashboard()

tesla_stock.attach(email_alert)
tesla_stock.attach(sms_alert)
tesla_stock.attach(dashboard)

# Price changes - all observers notified automatically
tesla_stock.price = 255.00
# Output:
# Email to investor@example.com: TSLA increased from $250.0 to $255.0
# Dashboard: Updating TSLA to $255.0

tesla_stock.price = 260.50
# Output:
# Email to investor@example.com: TSLA increased from $255.0 to $260.5
# SMS to +1234567890: TSLA changed by $5.5
# Dashboard: Updating TSLA to $260.5

# Unsubscribe
tesla_stock.detach(email_alert)
tesla_stock.price = 265.00
# Only SMS and Dashboard notified
```

**Interview Example - Social Media:**
```python
class User(Subject):
    """User who posts updates"""
    
    def __init__(self, username: str):
        super().__init__()
        self.username = username
    
    def post(self, message: str):
        """Post update - notify followers"""
        print(f"\n{self.username} posted: '{message}'")
        self.notify({
            "user": self.username,
            "message": message,
            "timestamp": "2024-11-30 10:30:00"
        })

class Follower(Observer):
    """Follower receives notifications"""
    
    def __init__(self, name: str):
        self.name = name
    
    def update(self, event: dict):
        print(f"  📱 {self.name} notified: {event['user']} posted")

# Usage
alice = User("Alice")
bob = Follower("Bob")
charlie = Follower("Charlie")
diana = Follower("Diana")

# Bob, Charlie, Diana follow Alice
alice.attach(bob)
alice.attach(charlie)
alice.attach(diana)

alice.post("Hello everyone!")
# Bob, Charlie, Diana all notified

charlie.update = lambda event: print(f"  🔕 {self.name} has muted {event['user']}")
# Charlie muted Alice (custom behavior)

alice.post("Another update")
# Bob and Diana notified, Charlie sees muted message
```

---

## 6.3 Command Pattern - Encapsulate Requests as Objects

**When to Use:** When you need to parameterize objects with operations, queue operations, or support undo/redo.

**Problem:**
```python
# ❌ Tight coupling between invoker and receiver
button.onclick = lambda: document.save()
# Button knows about document directly
```

**Command Pattern Solution:**
```python
class Command(ABC):
    """Command interface"""
    
    @abstractmethod
    def execute(self):
        pass
    
    @abstractmethod
    def undo(self):
        pass

class Document:
    """Receiver - knows how to perform operations"""
    
    def __init__(self):
        self.content = ""
    
    def write(self, text: str):
        self.content += text
        print(f"Document content: '{self.content}'")
    
    def delete_last(self, length: int):
        self.content = self.content[:-length]
        print(f"Document content: '{self.content}'")

class WriteCommand(Command):
    """Concrete command"""
    
    def __init__(self, document: Document, text: str):
        self.document = document
        self.text = text
    
    def execute(self):
        self.document.write(self.text)
    
    def undo(self):
        self.document.delete_last(len(self.text))

class CommandInvoker:
    """Invoker - executes commands and maintains history"""
    
    def __init__(self):
        self.history = []
    
    def execute_command(self, command: Command):
        command.execute()
        self.history.append(command)
    
    def undo(self):
        if self.history:
            command = self.history.pop()
            command.undo()

# Usage
doc = Document()
invoker = CommandInvoker()

# Execute commands
invoker.execute_command(WriteCommand(doc, "Hello "))
invoker.execute_command(WriteCommand(doc, "World"))
invoker.execute_command(WriteCommand(doc, "!"))
# Document content: 'Hello World!'

# Undo commands
invoker.undo()  # Removes '!'
invoker.undo()  # Removes 'World'
# Document content: 'Hello '
```

**Interview Example - Smart Home:**
```python
class Light:
    """Receiver"""
    
    def __init__(self, location: str):
        self.location = location
        self.is_on = False
    
    def turn_on(self):
        self.is_on = True
        print(f"{self.location} light ON")
    
    def turn_off(self):
        self.is_on = False
        print(f"{self.location} light OFF")

class Thermostat:
    """Another receiver"""
    
    def __init__(self):
        self.temperature = 70
    
    def set_temperature(self, temp: int):
        self.temperature = temp
        print(f"Temperature set to {temp}°F")

class LightOnCommand(Command):
    def __init__(self, light: Light):
        self.light = light
        
    def execute(self):
        self.light.turn_on()
    
    def undo(self):
        self.light.turn_off()

class LightOffCommand(Command):
    def __init__(self, light: Light):
        self.light = light
    
    def execute(self):
        self.light.turn_off()
    
    def undo(self):
        self.light.turn_on()

class SetTemperatureCommand(Command):
    def __init__(self, thermostat: Thermostat, temp: int):
        self.thermostat = thermostat
        self.new_temp = temp
        self.old_temp = None
    
    def execute(self):
        self.old_temp = self.thermostat.temperature
        self.thermostat.set_temperature(self.new_temp)
    
    def undo(self):
        self.thermostat.set_temperature(self.old_temp)

class MacroCommand(Command):
    """Command that executes multiple commands"""
    
    def __init__(self, commands: list):
        self.commands = commands
    
    def execute(self):
        for command in self.commands:
            command.execute()
    
    def undo(self):
        for command in reversed(self.commands):
            command.undo()

class RemoteControl:
    """Invoker - programmable remote"""
    
    def __init__(self):
        self.commands = {}
        self.history = []
    
    def set_command(self, button: str, command: Command):
        self.commands[button] = command
    
    def press_button(self, button: str):
        if button in self.commands:
            command = self.commands[button]
            command.execute()
            self.history.append(command)
    
    def press_undo(self):
        if self.history:
            command = self.history.pop()
            command.undo()

# Setup
living_room_light = Light("Living Room")
bedroom_light = Light("Bedroom")
thermostat = Thermostat()

remote = RemoteControl()

# Program buttons
remote.set_command("1", LightOnCommand(living_room_light))
remote.set_command("2", LightOffCommand(living_room_light))
remote.set_command("3", SetTemperatureCommand(thermostat, 72))

# "Party mode" macro - turn on all lights, set temp
party_mode = MacroCommand([
    LightOnCommand(living_room_light),
    LightOnCommand(bedroom_light),
    SetTemperatureCommand(thermostat, 68)
])
remote.set_command("party", party_mode)

# Use remote
remote.press_button("1")  # Living Room light ON
remote.press_button("3")  # Temperature set to 72°F
remote.press_undo()       # Temperature back to 70°F

remote.press_button("party")  # Execute party mode
# Living Room light ON
# Bedroom light ON
# Temperature set to 68°F
```

---

## 6.4 State Pattern - Object Behavior Changes with State

**When to Use:** When an object's behavior depends on its state and must change at runtime.

**Problem - State Machine with If-Else:**
```python
# ❌ BAD - if-else nightmare
class Document:
    def __init__(self):
        self.state = "DRAFT"
    
    def publish(self):
        if self.state == "DRAFT":
            self.state = "MODERATION"
        elif self.state == "MODERATION":
            print("Already in moderation")
        elif self.state == "PUBLISHED":
            print("Already published")
    
    def approve(self):
        if self.state == "DRAFT":
            print("Cannot approve draft")
        elif self.state == "MODERATION":
            self.state = "PUBLISHED"
        elif self.state == "PUBLISHED":
            print("Already published")
    # Gets messy quickly!
```

**State Pattern Solution:**
```python
class State(ABC):
    """State interface"""
    
    @abstractmethod
    def publish(self, document: 'Document'):
        pass
    
    @abstractmethod
    def approve(self, document: 'Document'):
        pass

class DraftState(State):
    """Concrete state"""
    
    def publish(self, document: 'Document'):
        print("Document sent to moderation")
        document.set_state(ModerationState())
    
    def approve(self, document: 'Document'):
        print("Cannot approve draft - must publish first")

class ModerationState(State):
    """Concrete state"""
    
    def publish(self, document: 'Document'):
        print("Already in moderation")
    
    def approve(self, document: 'Document'):
        print("Document approved and published!")
        document.set_state(PublishedState())

class PublishedState(State):
    """Concrete state"""
    
    def publish(self, document: 'Document'):
        print("Already published")
    
    def approve(self, document: 'Document'):
        print("Already published")

class Document:
    """Context"""
    
    def __init__(self):
        self._state = DraftState()
    
    def set_state(self, state: State):
        self._state = state
    
    def publish(self):
        self._state.publish(self)
    
    def approve(self):
        self._state.approve(self)

# Usage
doc = Document()

doc.approve()  # Cannot approve draft - must publish first
doc.publish()  # Document sent to moderation
doc.approve()  # Document approved and published!
doc.publish()  # Already published
```

**Interview Example - Vending Machine:**
```python
class VendingMachineState(ABC):
    @abstractmethod
    def insert_money(self, machine: 'VendingMachine', amount: float):
        pass
    
    @abstractmethod
    def select_product(self, machine: 'VendingMachine', product: str):
        pass
    
    @abstractmethod
    def dispense(self, machine: 'VendingMachine'):
        pass

class IdleState(VendingMachineState):
    """Waiting for money"""
    
    def insert_money(self, machine: 'VendingMachine', amount: float):
        print(f"Money inserted: ${amount}")
        machine.balance += amount
        machine.set_state(HasMoneyState())
    
    def select_product(self, machine: 'VendingMachine', product: str):
        print("Please insert money first")
    
    def dispense(self, machine: 'VendingMachine'):
        print("Please insert money first")

class HasMoneyState(VendingMachineState):
    """Money inserted, waiting for selection"""
    
    def insert_money(self, machine: 'VendingMachine', amount: float):
        print(f"Additional money inserted: ${amount}")
        machine.balance += amount
    
    def select_product(self, machine: 'VendingMachine', product: str):
        price = machine.get_price(product)
        if machine.balance >= price:
            machine.selected_product = product
            machine.set_state(DispensingState())
        else:
            print(f"Insufficient funds. Need ${price - machine.balance} more")
    
    def dispense(self, machine: 'VendingMachine'):
        print("Please select a product first")

class DispensingState(VendingMachineState):
    """Dispensing product"""
    
    def insert_money(self, machine: 'VendingMachine', amount: float):
        print("Please wait, dispensing product")
    
    def select_product(self, machine: 'VendingMachine', product: str):
        print("Please wait, dispensing product")
    
    def dispense(self, machine: 'VendingMachine'):
        product = machine.selected_product
        price = machine.get_price(product)
        
        print(f"Dispensing {product}")
        machine.balance -= price
        
        # Return change
        if machine.balance > 0:
            print(f"Returning change: ${machine.balance}")
            machine.balance = 0
        
        machine.selected_product = None
        machine.set_state(IdleState())

class VendingMachine:
    """Context"""
    
    def __init__(self):
        self._state = IdleState()
        self.balance = 0.0
        self.selected_product = None
        self.prices = {
            "Coke": 1.50,
            "Pepsi": 1.50,
            "Water": 1.00,
            "Chips": 2.00
        }
    
    def set_state(self, state: VendingMachineState):
        self._state = state
    
    def get_price(self, product: str) -> float:
        return self.prices.get(product, 0)
    
    def insert_money(self, amount: float):
        self._state.insert_money(self, amount)
    
    def select_product(self, product: str):
        self._state.select_product(self, product)
    
    def dispense(self):
        self._state.dispense(self)

# Usage
machine = VendingMachine()

machine.select_product("Coke")  # Please insert money first
machine.insert_money(1.00)      # Money inserted: $1.0
machine.select_product("Coke")  # Insufficient funds. Need $0.5 more
machine.insert_money(1.00)      # Additional money inserted: $1.0
machine.select_product("Coke")  # Dispensing Coke, Returning change: $0.5
```

---

This completes the design patterns sections! Now let me add the Concurrency and Complete LLD examples sections to finish the guide. Should I continue?


# 7. Concurrency and Thread Safety {#concurrency}

## 7.1 Why Concurrency Matters in LLD

**The Problem:**
```python
# Single-threaded - processes one order at a time
for order in orders:
    process_order(order)  # Takes 1 second each
# 1000 orders = 1000 seconds (16+ minutes)

# Multi-threaded - processes multiple orders concurrently
with ThreadPoolExecutor(max_workers=10) as executor:
    executor.map(process_order, orders)
# 1000 orders = 100 seconds (less than 2 minutes)
```

## 7.2 Thread Safety - The Core Concept

**Race Condition Example:**
```python
class BankAccount:
    """❌ NOT thread-safe"""
    
    def __init__(self, balance=0):
        self.balance = balance
    
    def withdraw(self, amount):
        # Race condition!
        if self.balance >= amount:
            # Thread can be interrupted here
            time.sleep(0.001)  # Simulate some processing
            self.balance -= amount
            return True
        return False

# Problem demonstration
account = BankAccount(100)

def make_withdrawal():
    account.withdraw(100)

# Two threads try to withdraw $100 simultaneously
thread1 = Thread(target=make_withdrawal)
thread2 = Thread(target=make_withdrawal)

thread1.start()
thread2.start()
thread1.join()
thread2.join()

print(account.balance)  # Could be 0, -100, or -200!
# Race condition - both checked balance before either withdrew
```

**Solution - Thread-Safe with Lock:**
```python
import threading

class ThreadSafeBankAccount:
    """✅ Thread-safe version"""
    
    def __init__(self, balance=0):
        self.balance = balance
        self._lock = threading.Lock()  # Lock for synchronization
    
    def withdraw(self, amount):
        with self._lock:  # Acquire lock
            if self.balance >= amount:
                time.sleep(0.001)
                self.balance -= amount
                return True
            return False
        # Lock released automatically

# Now safe
account = ThreadSafeBankAccount(100)

# Same two threads
thread1 = Thread(target=lambda: account.withdraw(100))
thread2 = Thread(target=lambda: account.withdraw(100))

thread1.start()
thread2.start()
thread1.join()
thread2.join()

print(account.balance)  # Always 0 (one succeeds, one fails)
```

---

## 7.3 Synchronization Primitives

### 1. Lock (Mutex)

**When to Use:** Protect shared data from concurrent access.

```python
class Counter:
    """Thread-safe counter"""
    
    def __init__(self):
        self._value = 0
        self._lock = threading.Lock()
    
    def increment(self):
        with self._lock:
            self._value += 1
    
    def get_value(self):
        with self._lock:
            return self._value

# Usage
counter = Counter()

def worker():
    for _ in range(1000):
        counter.increment()

threads = [Thread(target=worker) for _ in range(10)]
for t in threads:
    t.start()
for t in threads:
    t.join()

print(counter.get_value())  # Always 10,000 (thread-safe)
```

### 2. RLock (Reentrant Lock)

**When to Use:** When same thread needs to acquire lock multiple times.

```python
class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
        self._lock = threading.RLock()  # Reentrant lock
    
    def insert(self, value):
        with self._lock:
            if value < self.value:
                if self.left is None:
                    self.left = TreeNode(value)
                else:
                    # Can acquire lock again (reentrant)
                    self.left.insert(value)
            else:
                if self.right is None:
                    self.right = TreeNode(value)
                else:
                    self.right.insert(value)
```

### 3. Semaphore

**When to Use:** Limit concurrent access to a resource.

```python
class ConnectionPool:
    """Database connection pool with limited connections"""
    
    def __init__(self, max_connections=5):
        self._semaphore = threading.Semaphore(max_connections)
        self._connections = []
    
    def acquire_connection(self):
        self._semaphore.acquire()  # Wait if all connections in use
        print(f"Connection acquired by {threading.current_thread().name}")
        return f"Connection-{len(self._connections)}"
    
    def release_connection(self, conn):
        print(f"Connection released by {threading.current_thread().name}")
        self._semaphore.release()

# Usage
pool = ConnectionPool(max_connections=3)

def use_database():
    conn = pool.acquire_connection()
    time.sleep(2)  # Simulate database work
    pool.release_connection(conn)

# 10 threads trying to use 3 connections
threads = [Thread(target=use_database, name=f"Thread-{i}") 
           for i in range(10)]

for t in threads:
    t.start()
for t in threads:
    t.join()

# Only 3 threads can use connections at once
# Others wait until a connection is released
```

### 4. Condition Variable

**When to Use:** Thread coordination - wait for condition to become true.

```python
class BlockingQueue:
    """Thread-safe queue with blocking operations"""
    
    def __init__(self, max_size=10):
        self._queue = []
        self._max_size = max_size
        self._lock = threading.Lock()
        self._not_empty = threading.Condition(self._lock)
        self._not_full = threading.Condition(self._lock)
    
    def put(self, item):
        """Add item, wait if queue full"""
        with self._not_full:
            while len(self._queue) >= self._max_size:
                print(f"Queue full, waiting to put {item}")
                self._not_full.wait()  # Wait until not full
            
            self._queue.append(item)
            print(f"Put {item}, queue size: {len(self._queue)}")
            self._not_empty.notify()  # Notify waiting consumers
    
    def get(self):
        """Remove item, wait if queue empty"""
        with self._not_empty:
            while len(self._queue) == 0:
                print("Queue empty, waiting for items")
                self._not_empty.wait()  # Wait until not empty
            
            item = self._queue.pop(0)
            print(f"Got {item}, queue size: {len(self._queue)}")
            self._not_full.notify()  # Notify waiting producers
            return item

# Usage
queue = BlockingQueue(max_size=5)

def producer():
    for i in range(10):
        queue.put(f"Item-{i}")
        time.sleep(0.5)

def consumer():
    for i in range(10):
        item = queue.get()
        time.sleep(1)  # Slow consumer

producer_thread = Thread(target=producer)
consumer_thread = Thread(target=consumer)

producer_thread.start()
consumer_thread.start()
producer_thread.join()
consumer_thread.join()
```

---

## 7.4 Producer-Consumer Pattern

**Classic Concurrency Problem:**

```python
from queue import Queue
import threading
import time

class TaskQueue:
    """Thread-safe task queue"""
    
    def __init__(self):
        self._queue = Queue()
        self._shutdown = False
    
    def add_task(self, task):
        """Producer adds tasks"""
        self._queue.put(task)
    
    def get_task(self):
        """Consumer gets tasks"""
        return self._queue.get()
    
    def task_done(self):
        """Mark task as completed"""
        self._queue.task_done()
    
    def wait_completion(self):
        """Wait for all tasks to complete"""
        self._queue.join()
    
    def shutdown(self):
        """Signal shutdown"""
        self._shutdown = True

class Worker:
    """Consumer thread"""
    
    def __init__(self, task_queue: TaskQueue, worker_id: int):
        self.task_queue = task_queue
        self.worker_id = worker_id
        self.thread = threading.Thread(target=self.run)
    
    def start(self):
        self.thread.start()
    
    def run(self):
        while True:
            task = self.task_queue.get_task()
            
            if task is None:  # Poison pill for shutdown
                self.task_queue.task_done()
                break
            
            self.process_task(task)
            self.task_queue.task_done()
    
    def process_task(self, task):
        print(f"Worker-{self.worker_id} processing: {task}")
        time.sleep(1)  # Simulate work
        print(f"Worker-{self.worker_id} completed: {task}")

# Usage
task_queue = TaskQueue()

# Create worker pool
workers = [Worker(task_queue, i) for i in range(3)]
for worker in workers:
    worker.start()

# Producer adds tasks
for i in range(10):
    task_queue.add_task(f"Task-{i}")

# Wait for all tasks to complete
task_queue.wait_completion()

# Shutdown workers (send poison pill)
for _ in workers:
    task_queue.add_task(None)

for worker in workers:
    worker.thread.join()

print("All tasks completed!")
```

---

## 7.5 Thread-Safe Collections

**Interview Example - Thread-Safe Cache:**

```python
class ThreadSafeCache:
    """LRU cache with thread safety"""
    
    def __init__(self, capacity: int):
        self._capacity = capacity
        self._cache = {}
        self._access_order = []  # Track access for LRU
        self._lock = threading.RLock()
    
    def get(self, key: str):
        """Get value from cache"""
        with self._lock:
            if key in self._cache:
                # Update access order
                self._access_order.remove(key)
                self._access_order.append(key)
                return self._cache[key]
            return None
    
    def put(self, key: str, value):
        """Put value in cache"""
        with self._lock:
            if key in self._cache:
                # Update existing
                self._access_order.remove(key)
            elif len(self._cache) >= self._capacity:
                # Evict least recently used
                lru_key = self._access_order.pop(0)
                del self._cache[lru_key]
            
            self._cache[key] = value
            self._access_order.append(key)
    
    def size(self):
        """Get current size"""
        with self._lock:
            return len(self._cache)

# Usage
cache = ThreadSafeCache(capacity=100)

def worker(worker_id):
    for i in range(1000):
        key = f"key_{i % 50}"
        
        # Read
        value = cache.get(key)
        
        # Write
        if value is None:
            cache.put(key, f"value_{i}")

# Multiple threads accessing cache
threads = [threading.Thread(target=worker, args=(i,)) 
           for i in range(10)]

for t in threads:
    t.start()
for t in threads:
    t.join()

print(f"Cache size: {cache.size()}")
```

---

## 7.6 Deadlock Prevention

**Deadlock Example:**
```python
# ❌ Can cause deadlock
lock1 = threading.Lock()
lock2 = threading.Lock()

def thread1_work():
    with lock1:
        time.sleep(0.1)
        with lock2:  # Waits for lock2
            print("Thread 1 got both locks")

def thread2_work():
    with lock2:
        time.sleep(0.1)
        with lock1:  # Waits for lock1
            print("Thread 2 got both locks")

# Deadlock! Thread1 holds lock1, waits for lock2
#            Thread2 holds lock2, waits for lock1
```

**Solution - Lock Ordering:**
```python
# ✅ Always acquire locks in same order
def thread1_work():
    with lock1:
        with lock2:  # Always lock1 then lock2
            print("Thread 1 got both locks")

def thread2_work():
    with lock1:
        with lock2:  # Same order - prevents deadlock
            print("Thread 2 got both locks")
```

**Interview Example - Dining Philosophers:**
```python
class Philosopher:
    """Classic concurrency problem"""
    
    def __init__(self, name: str, left_fork, right_fork):
        self.name = name
        self.left_fork = left_fork
        self.right_fork = right_fork
    
    def dine(self):
        """✅ Prevent deadlock with lock ordering"""
        # Always acquire lower numbered fork first
        first_fork = min(self.left_fork, self.right_fork, 
                        key=lambda f: f.fork_id)
        second_fork = max(self.left_fork, self.right_fork, 
                         key=lambda f: f.fork_id)
        
        with first_fork.lock:
            print(f"{self.name} picked up fork {first_fork.fork_id}")
            with second_fork.lock:
                print(f"{self.name} picked up fork {second_fork.fork_id}")
                print(f"{self.name} is eating")
                time.sleep(1)
                print(f"{self.name} finished eating")

class Fork:
    def __init__(self, fork_id: int):
        self.fork_id = fork_id
        self.lock = threading.Lock()

# Create forks
forks = [Fork(i) for i in range(5)]

# Create philosophers
philosophers = [
    Philosopher("Plato", forks[0], forks[1]),
    Philosopher("Aristotle", forks[1], forks[2]),
    Philosopher("Socrates", forks[2], forks[3]),
    Philosopher("Descartes", forks[3], forks[4]),
    Philosopher("Kant", forks[4], forks[0])
]

# All philosophers can eat without deadlock
threads = [threading.Thread(target=p.dine) for p in philosophers]
for t in threads:
    t.start()
for t in threads:
    t.join()
```

---

This completes the concurrency section! Now I'll add complete LLD examples (Parking Lot, Chess, etc.). Should I continue?


# 10. Complete LLD Examples {#complete-examples}

## 10.1 Parking Lot System - Complete Implementation

**Requirements:**
- Multiple floors, each with multiple spots
- Different spot types: compact, large, motorcycle
- Different vehicle types: car, truck, motorcycle
- Entry/exit gates
- Payment system
- Display available spots

**Step 1: Identify Core Entities**
```
- ParkingLot
- ParkingFloor
- ParkingSpot (different types)
- Vehicle (different types)
- ParkingTicket
- Payment
- EntryGate
- ExitGate
```

**Step 2: Class Diagram (Mental Model)**
```
ParkingLot
├── has multiple ParkingFloors
├── has EntryGate and ExitGate
└── manages ParkingTickets

ParkingFloor
└── has multiple ParkingSpots

ParkingSpot (abstract)
├── CompactSpot
├── LargeSpot
└── MotorcycleSpot

Vehicle (abstract)
├── Car
├── Truck
└── Motorcycle
```

**Complete Implementation:**

```python
from enum import Enum
from datetime import datetime
from typing import List, Optional
import threading

# Enums
class VehicleType(Enum):
    CAR = 1
    TRUCK = 2
    MOTORCYCLE = 3

class SpotType(Enum):
    COMPACT = 1
    LARGE = 2
    MOTORCYCLE = 3

class ParkingSpotStatus(Enum):
    AVAILABLE = 1
    OCCUPIED = 2

# Vehicle classes
class Vehicle(ABC):
    """Base class for all vehicles"""
    
    def __init__(self, license_plate: str):
        self.license_plate = license_plate
    
    @abstractmethod
    def get_type(self) -> VehicleType:
        pass

class Car(Vehicle):
    def get_type(self) -> VehicleType:
        return VehicleType.CAR

class Truck(Vehicle):
    def get_type(self) -> VehicleType:
        return VehicleType.TRUCK

class Motorcycle(Vehicle):
    def get_type(self) -> VehicleType:
        return VehicleType.MOTORCYCLE

# Parking Spot classes
class ParkingSpot(ABC):
    """Base class for parking spots"""
    
    def __init__(self, spot_id: str, floor_id: int):
        self.spot_id = spot_id
        self.floor_id = floor_id
        self.status = ParkingSpotStatus.AVAILABLE
        self.vehicle = None
        self._lock = threading.Lock()
    
    @abstractmethod
    def get_type(self) -> SpotType:
        pass
    
    def can_fit_vehicle(self, vehicle: Vehicle) -> bool:
        """Check if vehicle can fit in this spot"""
        if self.status == ParkingSpotStatus.OCCUPIED:
            return False
        
        vehicle_type = vehicle.get_type()
        spot_type = self.get_type()
        
        # Matching rules
        if spot_type == SpotType.MOTORCYCLE:
            return vehicle_type == VehicleType.MOTORCYCLE
        elif spot_type == SpotType.COMPACT:
            return vehicle_type in [VehicleType.MOTORCYCLE, VehicleType.CAR]
        else:  # LARGE
            return True  # Can fit any vehicle
    
    def park_vehicle(self, vehicle: Vehicle) -> bool:
        """Thread-safe parking"""
        with self._lock:
            if not self.can_fit_vehicle(vehicle):
                return False
            
            self.vehicle = vehicle
            self.status = ParkingSpotStatus.OCCUPIED
            return True
    
    def remove_vehicle(self) -> Optional[Vehicle]:
        """Thread-safe removal"""
        with self._lock:
            if self.status == ParkingSpotStatus.AVAILABLE:
                return None
            
            vehicle = self.vehicle
            self.vehicle = None
            self.status = ParkingSpotStatus.AVAILABLE
            return vehicle

class CompactSpot(ParkingSpot):
    def get_type(self) -> SpotType:
        return SpotType.COMPACT

class LargeSpot(ParkingSpot):
    def get_type(self) -> SpotType:
        return SpotType.LARGE

class MotorcycleSpot(ParkingSpot):
    def get_type(self) -> SpotType:
        return SpotType.MOTORCYCLE

# Parking Floor
class ParkingFloor:
    """Represents one floor of parking lot"""
    
    def __init__(self, floor_id: int):
        self.floor_id = floor_id
        self.spots: List[ParkingSpot] = []
    
    def add_spot(self, spot: ParkingSpot):
        self.spots.append(spot)
    
    def find_available_spot(self, vehicle: Vehicle) -> Optional[ParkingSpot]:
        """Find first available spot for vehicle"""
        for spot in self.spots:
            if spot.can_fit_vehicle(vehicle):
                return spot
        return None
    
    def get_available_count(self, spot_type: SpotType) -> int:
        """Count available spots of specific type"""
        return sum(1 for spot in self.spots 
                  if spot.get_type() == spot_type 
                  and spot.status == ParkingSpotStatus.AVAILABLE)

# Parking Ticket
class ParkingTicket:
    """Ticket issued when vehicle enters"""
    
    _ticket_counter = 0
    _counter_lock = threading.Lock()
    
    def __init__(self, vehicle: Vehicle, spot: ParkingSpot):
        with ParkingTicket._counter_lock:
            ParkingTicket._ticket_counter += 1
            self.ticket_id = f"TICKET-{ParkingTicket._ticket_counter}"
        
        self.vehicle = vehicle
        self.spot = spot
        self.entry_time = datetime.now()
        self.exit_time = None
        self.fee = 0.0
    
    def calculate_fee(self) -> float:
        """Calculate parking fee based on duration"""
        if self.exit_time is None:
            self.exit_time = datetime.now()
        
        duration = (self.exit_time - self.entry_time).total_seconds() / 3600  # hours
        
        # Pricing: $2/hour for motorcycle, $4/hour for car, $6/hour for truck
        rates = {
            VehicleType.MOTORCYCLE: 2.0,
            VehicleType.CAR: 4.0,
            VehicleType.TRUCK: 6.0
        }
        
        rate = rates.get(self.vehicle.get_type(), 4.0)
        self.fee = duration * rate
        return self.fee

# Payment
class Payment:
    """Handle payment processing"""
    
    def __init__(self, ticket: ParkingTicket):
        self.ticket = ticket
        self.amount = ticket.fee
        self.payment_time = None
        self.is_paid = False
    
    def process_payment(self, amount: float) -> bool:
        """Process payment"""
        if amount >= self.amount:
            self.is_paid = True
            self.payment_time = datetime.now()
            return True
        return False

# Main Parking Lot
class ParkingLot:
    """Singleton parking lot"""
    
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls, name: str, address: str):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance
    
    def __init__(self, name: str, address: str):
        if self._initialized:
            return
        
        self.name = name
        self.address = address
        self.floors: List[ParkingFloor] = []
        self.active_tickets = {}  # ticket_id -> ParkingTicket
        self._tickets_lock = threading.Lock()
        self._initialized = True
    
    def add_floor(self, floor: ParkingFloor):
        self.floors.append(floor)
    
    def park_vehicle(self, vehicle: Vehicle) -> Optional[ParkingTicket]:
        """Park vehicle and issue ticket"""
        # Find available spot across all floors
        for floor in self.floors:
            spot = floor.find_available_spot(vehicle)
            if spot and spot.park_vehicle(vehicle):
                # Create ticket
                ticket = ParkingTicket(vehicle, spot)
                
                with self._tickets_lock:
                    self.active_tickets[ticket.ticket_id] = ticket
                
                print(f"Vehicle {vehicle.license_plate} parked at Floor {floor.floor_id}, "
                      f"Spot {spot.spot_id}")
                print(f"Ticket ID: {ticket.ticket_id}")
                return ticket
        
        print("No available spots!")
        return None
    
    def unpark_vehicle(self, ticket_id: str) -> Optional[Payment]:
        """Unpark vehicle and generate payment"""
        with self._tickets_lock:
            ticket = self.active_tickets.get(ticket_id)
            if not ticket:
                print("Invalid ticket!")
                return None
        
        # Remove vehicle from spot
        vehicle = ticket.spot.remove_vehicle()
        if not vehicle:
            print("Spot already empty!")
            return None
        
        # Calculate fee
        fee = ticket.calculate_fee()
        payment = Payment(ticket)
        
        print(f"Vehicle {vehicle.license_plate} removed from "
              f"Floor {ticket.spot.floor_id}, Spot {ticket.spot.spot_id}")
        print(f"Parking duration: {(ticket.exit_time - ticket.entry_time).total_seconds() / 3600:.2f} hours")
        print(f"Fee: ${fee:.2f}")
        
        # Remove from active tickets
        with self._tickets_lock:
            del self.active_tickets[ticket_id]
        
        return payment
    
    def display_available_spots(self):
        """Display available spots per floor"""
        print("\n=== Available Parking Spots ===")
        for floor in self.floors:
            motorcycle_spots = floor.get_available_count(SpotType.MOTORCYCLE)
            compact_spots = floor.get_available_count(SpotType.COMPACT)
            large_spots = floor.get_available_count(SpotType.LARGE)
            
            print(f"Floor {floor.floor_id}:")
            print(f"  Motorcycle: {motorcycle_spots}")
            print(f"  Compact: {compact_spots}")
            print(f"  Large: {large_spots}")

# Usage Example
def demo_parking_lot():
    # Create parking lot (Singleton)
    parking_lot = ParkingLot("City Center Parking", "123 Main St")
    
    # Setup Floor 1
    floor1 = ParkingFloor(1)
    floor1.add_spot(MotorcycleSpot("M1-1", 1))
    floor1.add_spot(MotorcycleSpot("M1-2", 1))
    floor1.add_spot(CompactSpot("C1-1", 1))
    floor1.add_spot(CompactSpot("C1-2", 1))
    floor1.add_spot(CompactSpot("C1-3", 1))
    floor1.add_spot(LargeSpot("L1-1", 1))
    floor1.add_spot(LargeSpot("L1-2", 1))
    
    # Setup Floor 2
    floor2 = ParkingFloor(2)
    floor2.add_spot(MotorcycleSpot("M2-1", 2))
    floor2.add_spot(CompactSpot("C2-1", 2))
    floor2.add_spot(CompactSpot("C2-2", 2))
    floor2.add_spot(LargeSpot("L2-1", 2))
    
    parking_lot.add_floor(floor1)
    parking_lot.add_floor(floor2)
    
    # Display initial availability
    parking_lot.display_available_spots()
    
    # Park vehicles
    print("\n=== Parking Vehicles ===")
    car1 = Car("ABC-123")
    ticket1 = parking_lot.park_vehicle(car1)
    
    motorcycle1 = Motorcycle("XYZ-789")
    ticket2 = parking_lot.park_vehicle(motorcycle1)
    
    truck1 = Truck("TRK-456")
    ticket3 = parking_lot.park_vehicle(truck1)
    
    # Display updated availability
    parking_lot.display_available_spots()
    
    # Simulate some time passing
    time.sleep(2)
    
    # Unpark vehicles
    print("\n=== Unparking Vehicles ===")
    if ticket1:
        payment = parking_lot.unpark_vehicle(ticket1.ticket_id)
        if payment:
            payment.process_payment(10.0)
    
    # Display final availability
    parking_lot.display_available_spots()

if __name__ == "__main__":
    demo_parking_lot()
```

**Interview Discussion Points:**

1. **Design Decisions:**
   - Why Singleton for ParkingLot?
   - Why abstract classes for Vehicle and ParkingSpot?
   - Why enum for types and statuses?

2. **SOLID Principles:**
   - SRP: Each class has one responsibility
   - OCP: Easy to add new vehicle/spot types
   - LSP: Subclasses can replace base classes
   - ISP: Focused interfaces
   - DIP: Depends on abstractions

3. **Thread Safety:**
   - Locks on parking spots
   - Locks on active tickets
   - Thread-safe ticket ID generation

4. **Extensibility:**
   - Easy to add electric vehicle charging spots
   - Easy to add VIP parking
   - Easy to add reservation system
   - Easy to change pricing strategy (Strategy pattern)

---

## 10.2 Quick Reference - Other Complete Examples

Due to space, here are the key class structures for other common LLD problems:

### Elevator System
```python
class Elevator:
    - id, current_floor, state (IDLE, MOVING_UP, MOVING_DOWN)
    - requests: List[Request]
    - move(), open_doors(), close_doors()

class Request:
    - source_floor, destination_floor
    - direction (UP, DOWN)

class ElevatorController:
    - elevators: List[Elevator]
    - assign_request(request) -> Elevator  # Scheduling algorithm
    
class Button:
    - floor_number
    - press() -> Request

class Display:
    - current_floor, direction
    - update()
```

### Library Management System
```python
class Book:
    - isbn, title, author
    - status (AVAILABLE, BORROWED, RESERVED)

class Member:
    - member_id, name
    - borrowed_books: List[Book]
    - borrow(book), return_book(book)

class Librarian(Member):
    - add_book(), remove_book()
    - register_member()

class Library:
    - books: Dict[str, Book]
    - members: Dict[str, Member]
    - search(criteria), issue_book(), return_book()
```

### Splitwise (Expense Sharing)
```python
class User:
    - user_id, name, email
    - balances: Dict[User, float]

class Expense:
    - expense_id, amount, paid_by: User
    - splits: List[Split]

class Split(ABC):
    - user: User
    - amount: float

class EqualSplit(Split):
    pass

class ExactSplit(Split):
    - exact_amount: float

class PercentSplit(Split):
    - percentage: float

class Group:
    - members: List[User]
    - expenses: List[Expense]
    - add_expense(), settle_up()
```

---

# 11. Interview Strategy and Best Practices {#interview-strategy}

## 11.1 The LLD Interview Process

**Typical 45-60 Minute Timeline:**

```
Minutes 0-5: Problem Clarification
- Ask about requirements
- Clarify ambiguities
- Define scope

Minutes 5-15: Class Design
- Identify core entities
- Define relationships
- Draw class diagram (if required)
- Discuss design patterns

Minutes 15-40: Implementation
- Write code for core classes
- Implement key methods
- Handle edge cases

Minutes 40-55: Testing & Discussion
- Walk through scenarios
- Discuss thread safety
- Talk about extensibility

Minutes 55-60: Questions & Wrap-up
```

## 11.2 Common Mistakes to Avoid

**❌ Don't:**
1. Jump straight to coding without clarifying requirements
2. Over-engineer for a simple problem
3. Write code without explaining your thought process
4. Ignore edge cases
5. Forget about thread safety when relevant
6. Create god classes that do everything
7. Use primitive obsession (strings for everything)
8. Forget to apply SOLID principles

**✅ Do:**
1. Ask clarifying questions first
2. Think out loud
3. Start with high-level design
4. Apply design patterns where appropriate
5. Write clean, readable code
6. Consider extensibility
7. Discuss trade-offs
8. Test with examples

## 11.3 Communication Tips

**Structure Your Response:**

```
"Let me start by clarifying the requirements..."
"The core entities I see are..."
"I'll use [pattern name] because..."
"Let me implement the key methods..."
"For thread safety, I'll use..."
"To make this extensible, we could..."
```

## 11.4 Quick Design Pattern Selection Guide

```
Problem: Need single instance
→ Use: Singleton

Problem: Creating objects with many parameters
→ Use: Builder

Problem: Need different implementations
→ Use: Strategy or Factory

Problem: Add functionality without modifying code
→ Use: Decorator

Problem: Simplify complex subsystem
→ Use: Facade

Problem: Control access to object
→ Use: Proxy

Problem: Object behavior changes with state
→ Use: State

Problem: Notify multiple objects of changes
→ Use: Observer

Problem: Encapsulate operations
→ Use: Command
```

---

# Final Checklist for LLD Interviews

**Before the Interview:**
- [ ] Review OOP fundamentals
- [ ] Practice SOLID principles
- [ ] Know common design patterns
- [ ] Practice coding on whiteboard/shared doc
- [ ] Review concurrency basics

**During the Interview:**
- [ ] Clarify requirements (5 minutes)
- [ ] Identify entities and relationships
- [ ] Apply design principles
- [ ] Write clean, documented code
- [ ] Think about edge cases
- [ ] Discuss trade-offs
- [ ] Consider extensibility
- [ ] Stay calm and think out loud

**After Implementation:**
- [ ] Walk through example scenarios
- [ ] Discuss improvements
- [ ] Talk about scaling (if time)
- [ ] Answer follow-up questions

---

# Good Luck with Your LLD Interview! 🚀

Remember:
- **Communication** is as important as code quality
- **Design principles** matter more than perfect syntax
- **Extensibility** shows senior-level thinking
- **Trade-offs** demonstrate real-world understanding

**You've got this!**

---

