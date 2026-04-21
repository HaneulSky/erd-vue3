src/
├── app/                      # 🏛 Инициализация (самый внешний слой)
│   ├── App.vue
│   ├── router/
│   ├── store/                # Глобальный стейт
│   └── providers/
│
├── pages/                    # 📄 Сборка страниц из виджетов
│   ├── auth/
│   └── diagrams/
│
├── widgets/                  # 🧩 Самостоятельные блоки (UI + Логика)
│   ├── auth-form/
│   └── diagrams-list/
│
├── features/                 # ⚡ Действия пользователя (Use Cases)
│   ├── auth-by-password/
│   │   ├── model/            # Стейт, типы
│   │   ├── actions.ts        # 🔥 Сценарий: "Войти"
│   │   └── ui/
│   └── manage-diagrams/
│       ├── actions.ts        # 🔥 Сценарий: "Создать диаграмму"
│       └── ui/
│
├── entities/                 # 📦 Бизнес-сущности (Ядро)
│   ├── user/
│   │   ├── types.ts
│   │   ├── model/
│   │   └── api.ts            # Только сырые запросы
│   └── diagram/
│
└── shared/                   # 🛠 Инструменты (Инфраструктура)
    ├── api/                  # Fetch-клиент
    ├── ui/                   # Кнопки, инпуты (Atomic Design)
    ├── lib/                  # Утилиты
    └── config/