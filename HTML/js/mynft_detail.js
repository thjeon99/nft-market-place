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

	function getUrlVars() {
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for (var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	}

	var tokenId = getUrlVars()["tokenId"];


	var _tokenURI = await mintingEvent.methods.tokenURI(tokenId).call();
	var _ipfsinfo = ipfsInfo(_tokenURI);

	var name = _ipfsinfo.name;
	var imgurl = _ipfsinfo.image;
	var description = _ipfsinfo.description;
	var category = _ipfsinfo.category;

	$("#name").text(name);
	$("#imgurl").attr("src", imgurl);
	$("#description").text(description);
	$("#category").text(category);


	function ipfsInfo(_tokenURI) {
		$.ajax({
			url: _tokenURI,
			type: 'get',
			data: '',
			async: false,
			success: function (data) {
				console.log(data);
				//console.log(data.name);
				//console.log(data.image);

				name = data.name;
				image = data.image;
				description = data.description;
				category = data.attributes[0].value;



			},
			error: function (e) {
				console.log("값을 가져오지 못했습니다.");
			}
		});

		return {
			name: name,
			image: image,
			description: description,
			category: category,
		};

	}
});