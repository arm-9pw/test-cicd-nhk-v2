


request:
Method: GET
URL: {{VITE_API_BASE_URL}/}api/procurement-operations
QueryParam: groupState=PUR_PO_APPROVED

response:
```shell
[
    {
        "key": 647384366946620287,
        "operationType": "PURCHASE_REQUISITION",
        "documentNo": "PR-2024-001",
        "status": "PO_APPROVED",
        "projectName": "Equipment Purchase",
        "requester": "John Doe",
        "purchaseInCharge": null,
        "documentLocation": null,
        "children": [
            {
                "key": 647384366946620290,
                "operationType": "PURCHASE_ORDER",
                "documentNo": "PO-2024-001",
                "status": "PO_APPROVED",
                "projectName": null,
                "requester": "",
                "purchaseInCharge": "Jane Smith/Procurement",
                "documentLocation": "Jane Smith/Procurement",
                "children": [
                    {
                        "key": 647384366946620294,
                        "operationType": "GOOD_RECEIVE",
                        "documentNo": "GR-2024-001",
                        "status": "GR_PENDING",
                        "projectName": "",
                        "requester": "",
                        "purchaseInCharge": "",
                        "documentLocation": "",
                        "children": []
                    }
                ]
            }
        ]
    },
    {
        "key": 647384366946620291,
        "operationType": "PURCHASE_ORDER",
        "documentNo": "PO-2024-001",
        "status": "PO_APPROVED",
        "projectName": "Equipment Purchase",
        "requester": "",
        "purchaseInCharge": "Jane Smith/Procurement",
        "documentLocation": "Jane Smith/Procurement",
        "children": []
    }
]