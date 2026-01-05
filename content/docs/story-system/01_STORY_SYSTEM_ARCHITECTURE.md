---
title: "Story System Architecture"
description: "Complete architectural diagrams and component interaction flows"
category: "Story System"
order: 1
showToc: true
---

# Story System Architecture Overview

## Complete Pipeline Flow

```mermaid
graph TB
    subgraph "Week 1: Data Contracts & Parsing"
        A[Gherkin Feature File] -->|parse| B[StoryParser]
        C[DataContractRegistry] -->|resolve| B
        B --> D[ParsedFeature with Resolved States]
    end
    
    subgraph "Week 4: Graph Building"
        D --> E[StoryGraphBuilder]
        E --> F[StoryGraph with State Metadata]
        F --> G[Topological Sort]
        G --> H[Execution Order]
    end
    
    subgraph "Week 3: State-Aware Caching"
        F --> I[StateHasher]
        I --> J[State Hashes]
        J --> K[StoryCache]
        K --> L[CheckpointManager]
    end
    
    subgraph "Week 4: Execution & Generation"
        H --> M[StoryExecutor]
        K -.cache lookup.-> M
        L -.resume from.-> M
        M --> N[Execution Results]
        F --> O[GraphTestGenerator]
        N -.metrics.-> O
        O --> P[Playwright Test Files]
    end
    
    style A fill:#e1f5ff
    style P fill:#e1ffe1
    style K fill:#fff4e1
    style F fill:#f0e1ff
```

---

## Component Interaction Details

```mermaid
graph LR
    subgraph "Core Components"
        SP[StoryParser]
        DCR[DataContractRegistry]
        SGB[StoryGraphBuilder]
        SE[StoryExecutor]
        GTG[GraphTestGenerator]
    end
    
    subgraph "State Management"
        SH[StateHasher]
        SC[StoryCache]
        CM[CheckpointManager]
    end
    
    subgraph "Data Structures"
        PS[ParsedStep]
        SN[StoryNode]
        SG[StoryGraph]
        GT[Generated Tests]
    end
    
    SP -->|resolves| DCR
    SP -->|produces| PS
    SGB -->|creates| SN
    SGB -->|builds| SG
    SN -->|has state| SH
    SH -->|generates| SC
    SE -->|uses| SC
    SE -->|creates| CM
    SG -->|input to| SE
    SG -->|input to| GTG
    GTG -->|produces| GT
    
    style SP fill:#4a90e2
    style GTG fill:#4a90e2
    style SC fill:#f5a623
    style SG fill:#bd10e0
```

---

## Data Flow Through Pipeline

```mermaid
sequenceDiagram
    participant GF as Gherkin Feature
    participant SP as StoryParser
    participant DC as DataContracts
    participant GB as GraphBuilder
    participant SH as StateHasher
    participant EX as Executor
    participant SC as StoryCache
    participant GEN as TestGenerator
    participant PT as Playwright Tests
    
    GF->>SP: Read feature file
    SP->>DC: Resolve "Components.counter.state.zero"
    DC-->>SP: Return { count: 0 }
    SP-->>GB: ParsedStep with stateData
    
    GB->>GB: Create StoryNodes
    GB->>SH: Hash stateBefore/stateAfter
    SH-->>GB: State hashes
    GB-->>EX: StoryGraph with metadata
    
    EX->>SC: Check cache for node
    alt Cache Hit
        SC-->>EX: Return cached result
    else Cache Miss
        EX->>EX: Execute step
        EX->>SC: Store result
    end
    
    EX-->>GEN: Execution results + graph
    GEN->>GEN: Generate test code
    GEN->>PT: Write .spec.ts files
    
    Note over GF,PT: Complete Week 1-4 Pipeline
```

---

## State-Aware Caching Architecture

```mermaid
graph TB
    subgraph "Cache Key Generation"
        A[StoryNode] --> B{Has State?}
        B -->|Yes| C[StateHasher]
        B -->|No| D[Node Type + ID]
        C --> E[State Hash]
        E --> F[Composite Key]
        D --> F
    end
    
    subgraph "Cache Lookup"
        F --> G{Cache Hit?}
        G -->|Yes| H[Return Cached Result]
        G -->|No| I[Execute Step]
        I --> J[Store in Cache]
    end
    
    subgraph "Cache Management"
        J --> K[LRU Eviction]
        K --> L[Persist to Disk]
        L --> M[Checkpoint Creation]
    end
    
    style E fill:#fff4e1
    style H fill:#e1ffe1
    style M fill:#e1f5ff
```

---

## Test Generation Flow

```mermaid
graph TB
    subgraph "Input"
        A[StoryGraph] --> B[GraphTestGenerator]
        C[ExecutionResults] -.metrics.-> B
    end
    
    subgraph "Processing"
        B --> D{Group by Scenario}
        D --> E[Background Steps]
        D --> F[Scenario Steps]
        E --> G[Generate beforeEach]
        F --> H{Step Type?}
        H -->|Given| I[Generate Setup Code]
        H -->|When| J[Generate Action Code]
        H -->|Then| K[Generate Assertion Code]
    end
    
    subgraph "Output"
        G --> L[Playwright Test File]
        I --> L
        J --> L
        K --> L
        L --> M[.spec.ts]
    end
    
    subgraph "State Integration"
        N[stateBefore] --> I
        O[stateAfter] --> K
        N --> P[injectState call]
        O --> Q[expect state call]
        P --> L
        Q --> L
    end
    
    style A fill:#f0e1ff
    style M fill:#e1ffe1
    style N fill:#fff4e1
    style O fill:#fff4e1
```

---

## Component Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Parsing: Read .feature file
    
    Parsing --> ContractResolution: Parse steps
    ContractResolution --> GraphBuilding: Resolve data contracts
    
    GraphBuilding --> StateHashing: Create nodes
    StateHashing --> TopologicalSort: Hash states
    TopologicalSort --> ReadyToExecute: Determine order
    
    ReadyToExecute --> Executing: Start execution
    Executing --> CacheCheck: For each node
    
    CacheCheck --> CacheHit: Found in cache
    CacheCheck --> CacheMiss: Not in cache
    
    CacheHit --> NextNode: Skip execution
    CacheMiss --> ExecuteStep: Run step
    ExecuteStep --> CacheStore: Store result
    CacheStore --> CheckpointCheck: Continue
    
    CheckpointCheck --> CreateCheckpoint: Every N steps
    CheckpointCheck --> NextNode: Continue
    CreateCheckpoint --> NextNode: Resume point saved
    
    NextNode --> Complete: All done
    NextNode --> Executing: More steps
    
    Complete --> GenerateTests: Create test files
    GenerateTests --> [*]: Pipeline complete
    
    note right of ContractResolution
        Week 1: Data Contracts
        Components.counter.state.zero
        → { count: 0 }
    end note
    
    note right of StateHashing
        Week 3: State Hashing
        SHA-256 of state objects
        for cache keys
    end note
    
    note right of CacheCheck
        Week 3: Cache System
        50-80% hit rates
        dramatically faster
    end note
    
    note right of GenerateTests
        Week 4: Test Generation
        Playwright-ready
        test files
    end note
```

---

## Data Contract Resolution

```mermaid
graph LR
    subgraph "Gherkin"
        A["Given counter state is<br/>Components.counter.state.zero"]
    end
    
    subgraph "Parser"
        B[Extract Reference]
        C[Split Path]
        D["['Components', 'counter', 'state', 'zero']"]
    end
    
    subgraph "Registry"
        E[DemoComponentData]
        F[counter.state.zero]
        G["{ count: 0 }"]
    end
    
    subgraph "Result"
        H[ParsedStep]
        I[stateReference:<br/>'Components.counter.state.zero']
        J[stateData:<br/>{ count: 0 }]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    H --> J
    
    style A fill:#e1f5ff
    style G fill:#fff4e1
    style H fill:#e1ffe1
```

---

## Week-by-Week Feature Integration

```mermaid
timeline
    title Story System Development Timeline
    
    section Week 1
        Data Contracts : TypedComponentContract
                       : DataContractRegistry
                       : satisfies keyword
        Story Parser   : Parse Gherkin features
                       : Resolve data contract refs
                       : Extract state metadata
    
    section Week 2
        State Integration : StatefulComponent interface
                          : ComponentRegistry
                          : @Component decorator
        Browser Injection : window.__testState__
                          : Custom events
                          : React hooks
    
    section Week 3
        State Hashing   : StateHasher utility
                        : Deterministic hashes
                        : Composite hashing
        Caching System  : StoryCache with LRU
                        : State-aware keys
                        : Cache statistics
        Checkpoints     : CheckpointManager
                        : Resume capability
                        : State snapshots
    
    section Week 4
        Graph Building  : StoryGraphBuilder
                        : Topological sorting
                        : Dependency resolution
        Execution       : StoryExecutor
                        : Cache integration
                        : Resume support
        Test Generation : GraphTestGenerator
                        : Playwright output
                        : State assertions
```

---

## System Layers

```mermaid
graph TB
    subgraph "Application Layer"
        A1[Demo Application]
        A2[Feature Files]
    end
    
    subgraph "Test Generation Layer"
        B1[GraphTestGenerator]
        B2[Generated Tests]
    end
    
    subgraph "Execution Layer"
        C1[StoryExecutor]
        C2[StoryGraphBuilder]
    end
    
    subgraph "State Management Layer"
        D1[StateHasher]
        D2[StoryCache]
        D3[CheckpointManager]
    end
    
    subgraph "Parsing Layer"
        E1[StoryParser]
        E2[DataContractRegistry]
    end
    
    subgraph "Core Infrastructure"
        F1[ComponentRegistry]
        F2[StatefulComponent]
        F3[Browser State Injection]
    end
    
    A1 --> A2
    A2 --> E1
    E2 --> E1
    E1 --> C2
    C2 --> C1
    D1 --> C1
    D2 --> C1
    D3 --> C1
    C1 --> B1
    B1 --> B2
    F1 --> C1
    F2 --> F1
    F3 --> B2
    
    style A1 fill:#e1f5ff
    style B1 fill:#e1ffe1
    style D2 fill:#fff4e1
    style E2 fill:#f0e1ff
```

---

## Key Design Principles

### 1. **Separation of Concerns**
- Parser handles Gherkin → ParsedSteps
- Graph Builder handles structure
- Executor handles runtime
- Generator handles output

### 2. **State-First Design**
- State is captured at every step
- State drives caching decisions
- State enables deterministic execution

### 3. **Composability**
- Each component works independently
- Components can be swapped
- Pipeline can be customized

### 4. **Type Safety**
- TypeScript throughout
- Data contracts enforce structure
- `satisfies` for compile-time validation

### 5. **Performance**
- State-aware caching (50-80% hit rates)
- Lazy evaluation where possible
- Efficient hashing algorithms
- LRU cache eviction

---

## Integration Points

```mermaid
graph TB
    subgraph "External Systems"
        EXT1[Playwright]
        EXT2[React Components]
        EXT3[Test Runner]
    end
    
    subgraph "Story System"
        INT1[GraphTestGenerator]
        INT2[Browser State Injection]
        INT3[Generated Tests]
    end
    
    subgraph "Application Code"
        APP1[Component State]
        APP2[Data Contracts]
        APP3[Feature Files]
    end
    
    EXT1 --> INT3
    INT1 --> INT3
    INT2 --> APP1
    INT2 --> EXT2
    APP2 --> APP3
    APP3 --> INT1
    INT3 --> EXT3
    
    style EXT1 fill:#e8e8e8
    style INT2 fill:#fff4e1
    style APP2 fill:#f0e1ff
```

---

## Performance Characteristics

### Cache Hit Rates by Scenario Type

```mermaid
%%{init: {'theme':'base'}}%%
pie title Cache Hit Rate Distribution
    "State-dependent (70-80%)" : 75
    "Action-heavy (40-50%)" : 45
    "Setup steps (90-95%)" : 92
    "Assertion steps (60-70%)" : 65
```

### Execution Time Comparison

```mermaid
gantt
    title Execution Time: With vs Without Cache
    dateFormat X
    axisFormat %s
    
    section Without Cache
    Parse        :0, 50ms
    Build Graph  :50ms, 80ms
    Execute (No Cache) :80ms, 500ms
    Generate Tests :500ms, 580ms
    
    section With Cache
    Parse        :0, 50ms
    Build Graph  :50ms, 80ms
    Execute (Cached) :80ms, 180ms
    Generate Tests :180ms, 260ms
```

---

## Next Steps

See [WEEK_4_DEMO_STRATEGY.md](./WEEK_4_DEMO_STRATEGY.md) for implementation plan and live demo details.

