$(window).load(async function () {
	var contractAddress;
	//블록체인 네트워크 선택하기
	var blockChainNetwork = localStorage.getItem("blockChainNetwork")
	$("#selectNetwork").val(blockChainNetwork).prop("selected", true);


	if (blockChainNetwork == "MATIC_MUMBAI") {
		contractAddress = contractAddress_MATIC_MUMBAI;
	}

	else if (blockChainNetwork == "KLAY_BAOBAB") {
		contractAddress = contractAddress_KLAY_BAOBAB;
	}

	else if (blockChainNetwork == "ETH_RINKEBY") {
		contractAddress = contractAddress_ETH_RINKEBY;
	}




	if (typeof web3 !== "undefined") {
		console.log("web3가 활성화되었습니다");

		$("#resultbrowsers").text("메타마스크를 로그인 해주세요!");

		if (web3.currentProvider.isMetaMask == true) {
			$("#resultbrowsers").text("메타마스크가 활성화되었습니다");
			try {

				accounts = await ethereum.request({
					method: "eth_requestAccounts"
				});

				$("#showAccount").text(accounts);
				//web3
				window.web3 = new Web3(window.ethereum);

				var mintingEvent = await new window.web3.eth.Contract(
					abiobj,
					contractAddress
				);


			} catch (error) {
				console.log(`error msg: ${error}`);
				$("#resultbrowsers").text("메타마스크를 로그인 해주세요!");
				return false;
			}
		} else {
			$("#resultbrowsers").text("메타마스크를 사용할 수  없니댜.");
		}
	} else {
		$("#resultbrowsers").text("web3를 찾을 수 없습니다.");
	}

	const tempnftListArray = await mintingEvent.methods.getSaleNftTokens().call();
	console.log(tempnftListArray)

	let i = 0;

	for (i = 0; i < tempnftListArray.length; i++) {

		_nftTokenId = tempnftListArray[i].nftTokenId;
		_nftTokenURI = tempnftListArray[i].nftTokenURI;
		_price = tempnftListArray[i].price;

		_ipfsinfo = ipfsInfo(_nftTokenURI);
		name = _ipfsinfo.name;
		image = _ipfsinfo.image;

		//console.log(v);


		var html = '';

		html += '<tr id="tr_' + _nftTokenId + '">';
		html += '<td>' + (i + 1) + '</td>';
		html += '<td>' + _nftTokenId + '</td>';

		html += '<td>' + _price + '</td>';

		html += '<td>' + name + '</td>';
		html += '<td><img src=' + image + ' width=100px/></td>';

		html += '<td>';
		html += '<a href="./mynft_detail.html?tokenId=' + _nftTokenId + '" class="btn btn-secondary btn-flat">상세보기</a> ';
		html += '<button type="button" class="btn btn-success btn_buy" data-bs-toggle="modal" data-bs-target="#saleModal" data-val="' + _nftTokenId + '" data-price-val="' + _price + '"  ">구매하기</button> ';
		html += '<button type="button" class="btn btn-danger btn_burn"" data-val="' + _nftTokenId + '">삭제하기</button> ';

		html += '</td> ';
		html += '</tr>';

		$("#dynamicTbody").append(html);
	}



	if (i == 0) {

		var html = '';

		html += '<tr>';
		html += '<td colspan="6" style="text-align:center;">자료없음</td> ';
		html += '</tr>';

		$("#dynamicTbody").append(html);

	}


	function ipfsInfo(_nftTokenURI) {
		$.ajax({
			url: _nftTokenURI,
			type: 'get',
			data: '',
			async: false,
			success: function (data) {
				//console.log(data);
				//console.log(data.name);
				//console.log(data.image);

				name = data.name;
				image = data.image;


			},
			error: function (e) {
				console.log("값을 가져오지 못했습니다.");
			}
		});

		return {
			name: name,
			image: image
		};

	}

	$('.btn_buy').click(function () {
		var tokenId = $(this).attr("data-val");
		var price = $(this).attr("data-price-val");
		$("#price").val(price)

		$('.modal-title').html("구매하기");
		$('#saleModal').modal('show');


		//구매하기
		$('.btn_buySubmit').click(async function () {
			var ownerAddress = await mintingEvent.methods.ownerOf(tokenId).call();
			console.log(ownerAddress.toLowerCase(), accounts[0]);

			if (ownerAddress.toLowerCase() == accounts[0]) {
				alert("제품 소유자는 구매할 수 없습니다.");
				return false;
			}

			if (!ApprovalState) {
				alert("판매승인 상태를 변경하세요");
				return false;
			}

			var receiptObj = await mintingEvent.methods.buyNftToken(tokenId).send({ from: accounts[0], value: price });
			console.log(receiptObj);
			location.reload();

		});

	});

});