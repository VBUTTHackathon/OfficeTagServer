# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|

  config.vm.box = "ubuntu/trusty32"
  config.vm.provision :shell, path: "bootstrap.sh", privileged: false
  config.vm.network :forwarded_port, guest: 1337, host: 1337, auto_correct: true
  config.vm.synced_folder '.', '/vagrant', nfs: true

  config.vm.provider :virtualbox do |vb|
    vb.customize ["modifyvm", :id, "--memory", "1024"]
    vb.customize ["modifyvm", :id, "--nictype1", "Am79C973"]
  end

end
