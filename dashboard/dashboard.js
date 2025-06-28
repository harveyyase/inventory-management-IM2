// Data for Purchase Orders By Status Chart
        const purchaseOrdersData = {
            labels: ['Complete', 'Incomplete', 'Pending'],
            datasets: [{
                data: [5, 3, 0],
                backgroundColor: ['#00D26A', '#FFC107', '#CCCCCC'],
                borderWidth: 0
            }]
        };
       
        // Data for Product Count Assigned To Supplier Chart
        const productCountData = {
            labels: ['Nestle', 'Robinson'],
            datasets: [{
                label: 'Suppliers',
                data: [2, 2],
                backgroundColor: ['#FF0000', '#0000FF'],
                borderWidth: 0,
                barThickness: 40,
            }]
        };
       
        // Data for Delivery History Per Day Chart
        const deliveryHistoryData = {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [{
                label: 'Product Delivered',
                data: [4, 2, 3, 6, 11],
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.4,
                pointBackgroundColor: '#36A2EB',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        };
       
        // Chart Configuration
        window.onload = function() {
            // Purchase Orders Chart (Pie Chart)
            const purchaseOrdersCtx = document.getElementById('purchaseOrdersChart').getContext('2d');
            const purchaseOrdersChart = new Chart(purchaseOrdersCtx, {
                type: 'pie',
                data: purchaseOrdersData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                boxWidth: 12,
                                padding: 15
                            }
                        }
                    }
                }
            });
           
            // Product Count Chart (Bar Chart)
            const productCountCtx = document.getElementById('productCountChart').getContext('2d');
            const productCountChart = new Chart(productCountCtx, {
                type: 'bar',
                data: productCountData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 3,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                boxWidth: 12,
                                padding: 15
                            }
                        }
                    }
                }
            });
           
            // Delivery History Chart (Line Chart)
            const deliveryHistoryCtx = document.getElementById('deliveryHistoryChart').getContext('2d');
            const deliveryHistoryChart = new Chart(deliveryHistoryCtx, {
                type: 'line',
                data: deliveryHistoryData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 12,
                            ticks: {
                                stepSize: 2
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                boxWidth: 12,
                                padding: 15
                            }
                        }
                    }
                }
            });
        };