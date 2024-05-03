<!-- ```mermaid
flowchart BT
    server[(server)]
    ichanges[incoming changes]
    ochanges[outgoing changes]
    clientw["`client working files
(what you're
currently editing)`"]
    clientg[client git repo]
    clientgq[client git queue]

    server->|pull|clientg
    server->|fetch|ichanges
    ichanges->|pull|clientg

    clientw->|stage changes|clientgq
    clientgq->|commit|clientg
    clientgq->|commit|ochanges

    ochanges->|push|server
``` -->

```mermaid
block-beta
columns 1
    block:SERVER:3
        server[("server")]
    end

    block:IO:3
        ichanges["incoming changes"] space ochanges["outgoing changes"]
    end

    block:CGIT:3
        cgit[("client git repo")] space
    end

    block:QUEUE:3
        space space cgq["client git queue"]
    end

    block:CLIENT:3
        clientw["client working files
(what you're
currently editing)"]
    end
    
    server--"fetch"-->ichanges
    ochanges--"push"-->server
    clientw--"stage"-->cgq
    QUEUE--"revert"-->clientw
    cgq--"commit"-->cgit
    cgq--"commit"-->ochanges
    ichanges--"merge"-->cgit
    server--"pull"-->cgit
```